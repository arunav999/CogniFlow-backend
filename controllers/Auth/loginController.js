// Bcrypt
import bcrypt from "bcryptjs";

// Error
import ApiError from "../../errors/Apierror.js";

// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Modles
import User from "../../models/User.js";

// Auth model
import Session from "../../models/Token Models/Session.js";
import RefreshToken from "../../models/Token Models/Refresh.js";

// Utils
import {
  generateToken,
  generateRefreshToken,
} from "../../utils/generateToken.js";
import { cryptoHash } from "../../utils/generateHash.js";

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
    if (remember) {
      const refreshToken = generateRefreshToken(user._id);
      const hashedRefreshToken = cryptoHash(refreshToken);

      // Store it in DB
      await RefreshToken.create({
        user: user._id,
        token: hashedRefreshToken,
      });

      // Cookie for Refresh token
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000, // Expires in 30 days
      });
    }

    const loginToken = generateToken(user._id);
    const hashedLoginToken = cryptoHash(loginToken);

    // Store login Session in DB
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

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Login successfull",
      userId: user._id,
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
      redirect: user.role === "admin" ? "/admin/dashboard" : "/u/dashboard",
    });
  } catch (error) {
    next(error);
  }
};
