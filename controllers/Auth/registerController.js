// ==================== Register Controller ====================
// Handles user registration, workspace assignment, and session creation

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Redis client
import { redisClient } from "../../config/redisClient.js";

// Constants for status codes and roles
import { STATUS_CODES } from "../../constants/statusCodes.js";
import { ROLES } from "../../constants/roles.js";

// Models for user and workspace
import User from "../../models/User.js";
import Workspace from "../../models/Workspace.js";

// Session model for authentication
import Session from "../../models/Token Models/Session.js";

// Utility functions for token and password hashing
import { generateToken } from "../../utils/generateToken.js";
import { bcryptHash, cryptoHash } from "../../utils/generateHash.js";

// Util for cookie options
import { cookieOptions } from "../../utils/utility.js";

// Main registration controller
export const registerUser = async (req, res, next) => {
  // Extract registration fields from request body
  const { firstName, lastName, email, password, role, company, inviteCode } =
    req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new ApiError(STATUS_CODES.CONFLICT, "Email already in use", "email")
      );
    }

    let workspaceId = null;

    // Admins do not require a workspace
    if (role === ROLES.ADMIN) workspaceId = null;

    // Managers/Developers require a valid invite code for workspace
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

    // Create with JWT and Hash with CRYPTO
    const signUpToken = generateToken(newUser._id);
    const hashedSignupToken = cryptoHash(signUpToken);

    // Old code - mongo
    // Store session in DB
    // await Session.create({
    //   user: newUser._id,
    //   token: hashedSignupToken,
    // });

    // New code - Redis
    await redisClient.setEx(
      `session:${hashedSignupToken}`,
      60 * 60 * 24, // 24 hours
      newUser._id.toString()
    );

    // Set cookie
    res.cookie("token", signUpToken, cookieOptions("24hr"));

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "User created successfully",
      user: {
        isVerified: newUser.isVerified,
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
      redirect:
        role === ROLES.ADMIN
          ? "/admin/workspaces"
          : role === ROLES.MANAGER
          ? "/manager"
          : "/developer",
    });
  } catch (error) {
    // Centeralized error handler
    next(error);
  }
};
