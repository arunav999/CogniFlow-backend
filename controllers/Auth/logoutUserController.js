// User Model
import Session from "../../models/Token Models/Session.js";
import RefreshToken from "../../models/Token Models/Refresh.js";

// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

export const logoutUser = async (req, res, next) => {
  try {
    const token = req.cookies?.loginToken;
    const refreshToken = req.cookies?.refreshToken;

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    // If no tokens
    if (!token && !refreshToken)
      return res
        .status(STATUS_CODES.OK)
        .json({ success: true, message: "Already logged out" });

    // If refresh token available
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
      res.clearCookie("refreshToken", cookieOptions);
    }

    // If session avilable
    if (token) {
      await Session.deleteOne({ token });
      res.clearCookie("loginToken", cookieOptions);
    }

    res
      .status(STATUS_CODES.OK)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
