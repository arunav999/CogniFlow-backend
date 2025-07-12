// Crypto
import crypto from "crypto";

// User Model
import Session from "../../models/Token Models/Session.js";
import RefreshToken from "../../models/Token Models/Refresh.js";

// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Utils
import { cryptoHash } from "../../utils/generateHash.js";

export const logoutUser = async (req, res, next) => {
  try {
    const signUpToken = req.cookies?.token;
    const loginToken = req.cookies?.loginToken;
    const refreshToken = req.cookies?.refreshToken;

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    };

    // if no tokens
    if (!signUpToken && !loginToken && !refreshToken) {
      return res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Already logged out",
      });
    }

    // If signuptoken
    if (signUpToken) {
      const hashedSignupToken = cryptoHash(signUpToken);

      // Delete from db
      await Session.deleteOne({ token: hashedSignupToken });
      res.clearCookie("token", cookieOptions);
    }

    // If login token
    if (loginToken) {
      const hashedLoginToken = cryptoHash(loginToken);

      // Delete from db
      await Session.deleteOne({ token: hashedLoginToken });
      res.clearCookie("loginToken", cookieOptions);
    }

    // If refresh token
    if (refreshToken) {
      const hashedRefreshToken = cryptoHash(refreshToken);

      // delete from db
      await RefreshToken.deleteOne({ token: hashedRefreshToken });
      res.clearCookie("refreshToken", cookieOptions);
    }

    res
      .status(STATUS_CODES.OK)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
