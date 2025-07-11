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

// JWT token
import { generateToken } from "../../utils/generateToken.js";

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
    let refreshToken;
    if (remember) {
      refreshToken = generateRefreshToken(user._id);

      // Store it in DB
      await RefreshToken.create({
        user: user._id,
        token: refreshToken,
      });

      // Cookie for Refresh token
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // Expires in 30 days
      });
    }

    const loginToken = generateToken(user._id);

    // Store login Session in DB
    await Session.create({
      user: user._id,
      token: loginToken,
    });

    res.cookie("loginToken", loginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // Expires in 24 hours
    });

    res.status(STATUS_CODES.OK).json({
      message: "Login successfull",
      userId: user._id,
      user,
      redirect: user.role === "admin" ? "/admin/dashboard" : "/u/dashboard",
    });
  } catch (error) {
    next(error);
  }
};
