// ==================== Logout Controller ====================
// Handles user logout, session and refresh token cleanup, and cookie removal

// Redis client
import { redisClient } from "../../config/redisClient.js";

// Models for session and refresh tokens
import Session from "../../models/Token Models/Session.js";
import RefreshToken from "../../models/Token Models/Refresh.js";

// Constants for status codes
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Utility for hashing tokens
import { cryptoHash } from "../../utils/generateHash.js";

// Utility for cookie options
import { cookieOptions } from "../../utils/utility.js";

// Main logout controller
export const logoutUser = async (req, res, next) => {
  try {
    // Extract tokens from cookies
    const signUpToken = req.cookies?.token;
    const loginToken = req.cookies?.loginToken;
    const refreshToken = req.cookies?.refreshToken;

    // Cookie options for clearing
    // const cookieOptions = {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "Strict",
    //   path: "/",
    // };

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

      // Old
      // await Session.deleteOne({ token: hashedSignupToken });

      // New
      await redisClient.del(`session:${hashedSignupToken}`);
      res.clearCookie("token", cookieOptions());
    }

    // Remove session for loginToken
    if (loginToken) {
      const hashedLoginToken = cryptoHash(loginToken);

      // Old
      // await Session.deleteOne({ token: hashedLoginToken });

      // New
      await redisClient.del(`session:${hashedLoginToken}`);
      res.clearCookie("loginToken", cookieOptions());
    }

    // Remove refresh token
    if (refreshToken) {
      const hashedRefreshToken = cryptoHash(refreshToken);

      // Old
      // await RefreshToken.deleteOne({ token: hashedRefreshToken });

      // New
      await redisClient.del(`refresh:${hashedRefreshToken}`);
      res.clearCookie("refreshToken", cookieOptions());
    }

    // Respond with logout success
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Logged out successfully",
      redirect: "/auth",
    });
  } catch (error) {
    next(error);
  }
};
