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

export const registerUser = async (req, res, next) => {
  const { firstName, lastName, email, password, role, company, inviteCode } =
    req.body;

  try {
    // If user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return new ApiError(
        STATUS_CODES.CONFLICT,
        "Email already in use",
        "email"
      );

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
    const newUser = User.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
      role,
      workspace: workspaceId,
    });

    res.status(STATUS_CODES.CREATED).json({
      message: "User created successfully",
      userId: (await newUser)._id,
      role: (await newUser).role,
      redirect: role === ROLES.ADMIN ? "/onboarding/workspace" : "/u/dashboard",
    });
  } catch (error) {
    // Centeralized error handler
    next(error);
  }
};
