// Bcrypt
import bcrypt from "bcryptjs";

// Error
import ApiError from "../errors/Apierror.js";

// Constants
import { STATUS_CODES } from "../constants/statusCodes.js";
import { ROLES } from "../constants/roles.js";

// Modles
import User from "../models/User.js";
import Workspace from "../models/Workspace.js";

// Auth model
import Session from "../models/Token Models/Session.js";
import RefreshToken from "../models/Token Models/Refresh.js";

// JWT token
import { generateToken, generateRefreshToken } from "../utils/generateToken.js";

// ===== Register User Controller =====
export const registerUser = async (req, res, next) => {
  const { firstName, lastName, email, password, role, company, inviteCode } =
    req.body;

  try {
    // If user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new ApiError(STATUS_CODES.CONFLICT, "Email already in use", "email")
      );
    }

    let workspaceId = null;

    // Admin flow
    if (role === ROLES.ADMIN) workspaceId = null;

    // Manager flow / Developer flow
    if (role === ROLES.MANAGER || role === ROLES.DEVELOPER) {
      const workspace = await Workspace.findOne({ inviteCode });

      if (!workspace)
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          "Invalid or expired invite code",
          "inviteCode"
        );

      workspaceId = workspace._id;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // If new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
      role,
      workspace: workspaceId,
      company,
    });

    // Create JWT
    const signUpToken = generateToken(newUser._id);

    // Store session in DB
    await Session.create({
      user: newUser._id,
      token: signUpToken,
    });

    res.cookie("token", signUpToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // Expires in 24 hours
    });

    res.status(STATUS_CODES.CREATED).json({
      message: "User created successfully",
      userId: newUser._id,
      role: newUser.role,
      redirect: role === ROLES.ADMIN ? "/onboarding/workspace" : "/u/dashboard",
    });
  } catch (error) {
    // Centeralized error handler
    next(error);
  }
};

// ===== Login User Controller =====
export const loginUser = async (req, res, next) => {
  const { email, password, remember } = req.body;

  try {
    // Get user
    const user = await User.findOne({ email });

    // If no-user
    if (!user || !(await bcrypt.compare(password, user.password)))
      return next(
        new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          "Invalid email or password",
          "login"
        )
      );

    // If user

    // ===== SENDING REFRESH TOKEN =====
    let refreshToken;
    if (remember) {
      refreshToken = generateRefreshToken(user._id);

      // Store it in DB
      await RefreshToken.create({
        user: user._id,
        token: refreshToken,
      });

      // Cookie for Refresh token
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // Expires in 30 days
      });
    }

    const loginToken = generateToken(user._id);

    // Store login Session in DB
    await Session.create({
      user: user._id,
      token: loginToken,
    });

    res.cookie("loginToken", loginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // Expires in 24 hours
    });

    res.status(STATUS_CODES.OK).json({
      message: "Login successfull",
      userId: user._id,
      user,
      redirect: user.role === "admin" ? "/admin/dashboard" : "/u/dashboard",
    });
  } catch (error) {
    next(error);
  }
};
