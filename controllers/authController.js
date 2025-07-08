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

// Session model
import Session from "../models/Session.js";

// JWT token
import { generateToken } from "../utils/generateToken.js";

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
    const token = generateToken(newUser._id);

    // Store session in DB
    await Session.create({
      user: newUser._id,
      token,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Change this in production to true
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // Expires in 24 hours
    });

    res.status(STATUS_CODES.CREATED).json({
      message: "User created successfully",
      userId: newUser._id,
      role: newUser.role,
      redirect: role === ROLES.ADMIN ? "/onboarding/workspace" : "/u/dashboard",
      token, // Remove in production
    });
  } catch (error) {
    // Centeralized error handler
    next(error);
  }
};
