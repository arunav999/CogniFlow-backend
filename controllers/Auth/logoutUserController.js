// ==================== Logout Controller ====================
// Handles user logout, session and refresh token cleanup, and cookie removal

// Crypto library for hashing
import crypto from "crypto";

// Models for session and refresh tokens
import Session from "../../models/Token Models/Session.js";
import RefreshToken from "../../models/Token Models/Refresh.js";

// Constants for status codes
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Utility for hashing tokens
import { cryptoHash } from "../../utils/generateHash.js";

// Main logout controller
export const logoutUser = async (req, res, next) => {
  try {
    // Extract tokens from cookies
    const signUpToken = req.cookies?.token;
    const loginToken = req.cookies?.loginToken;
    const refreshToken = req.cookies?.refreshToken;

    // Cookie options for clearing
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    };

    // If no tokens are present, user is already logged out
    if (!signUpToken && !loginToken && !refreshToken) {
      return res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Already logged out",
      });
    }

    // Remove session for signUpToken
    if (signUpToken) {
      const hashedSignupToken = cryptoHash(signUpToken);
      await Session.deleteOne({ token: hashedSignupToken });
      res.clearCookie("token", cookieOptions);
    }

    // Remove session for loginToken
    if (loginToken) {
      const hashedLoginToken = cryptoHash(loginToken);
      await Session.deleteOne({ token: hashedLoginToken });
      res.clearCookie("loginToken", cookieOptions);
    }

    // Remove refresh token
    if (refreshToken) {
      const hashedRefreshToken = cryptoHash(refreshToken);
      await RefreshToken.deleteOne({ token: hashedRefreshToken });
      res.clearCookie("refreshToken", cookieOptions);
    }

    // Respond with logout success
    res
      .status(STATUS_CODES.OK)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
