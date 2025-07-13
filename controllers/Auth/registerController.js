// Error
import ApiError from "../../errors/Apierror.js";

// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";
import { ROLES } from "../../constants/roles.js";

// Modles
import User from "../../models/User.js";
import Workspace from "../../models/Workspace.js";

// Auth model
import Session from "../../models/Token Models/Session.js";

// Utils
import { generateToken } from "../../utils/generateToken.js";
import { bcryptHash, cryptoHash } from "../../utils/generateHash.js";

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
    const passwordHash = await bcryptHash(password);

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

    // Hash JWT
    const hashedSignupToken = cryptoHash(signUpToken);

    // Store session in DB
    await Session.create({
      user: newUser._id,
      token: hashedSignupToken,
    });

    res.cookie("token", signUpToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // Expires in 24 hours
    });

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "User created successfully",
      userDetails: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        avatar: {
          url: newUser.avatar.url,
          public_id: newUser.avatar.public_id,
        },
        role: newUser.role,
        workspaces: newUser.workspaces,
        company: newUser.company,
      },
      redirect: role === ROLES.ADMIN ? "/onboarding/workspace" : "/u/dashboard",
    });
  } catch (error) {
    // Centeralized error handler
    next(error);
  }
};
