// ==================== Login Controller ====================
// Handles user login, session and refresh token creation, and cookie management

// Bcrypt for password comparison
import bcrypt from "bcryptjs";

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Constants for status codes
import { STATUS_CODES } from "../../constants/statusCodes.js";
import { ROLES } from "../../constants/roles.js";

// Models for user, session, and refresh tokens
import User from "../../models/User.js";
import Session from "../../models/Token Models/Session.js";
import RefreshToken from "../../models/Token Models/Refresh.js";

// Utility functions for token generation and hashing
import {
  generateToken,
  generateRefreshToken,
} from "../../utils/generateToken.js";
import { cryptoHash } from "../../utils/generateHash.js";

// Main login controller
export const loginUser = async (req, res, next) => {
  const { email, password, remember } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // If user not found or password does not match
    if (!user || !(await bcrypt.compare(password, user.password)))
      return next(
        new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          "Invalid email or password",
          "login"
        )
      );

    // If "remember" is set, create and store a refresh token
    if (remember) {
      const refreshToken = generateRefreshToken(user._id);
      const hashedRefreshToken = cryptoHash(refreshToken);
      await RefreshToken.create({
        user: user._id,
        token: hashedRefreshToken,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000, // Expires in 30 days
      });
    }

    // Create and store login session token
    const loginToken = generateToken(user._id);
    const hashedLoginToken = cryptoHash(loginToken);
    await Session.create({
      user: user._id,
      token: hashedLoginToken,
    });
    res.cookie("loginToken", loginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // Expires in 24 hours
    });

    // Respond with user details and redirect path
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Login successfull",
      user: {
        isVerified: user.isVerified,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: {
          url: user.avatar.url,
          public_id: user.avatar.public_id,
        },
        role: user.role,
        workspaces: user.workspaces,
        company: user.company,
      },
      redirect:
        user.role === ROLES.ADMIN
          ? "/admin"
          : user.role === ROLES.MANAGER
          ? "/manager"
          : "/developer",
    });
  } catch (error) {
    next(error);
  }
};
