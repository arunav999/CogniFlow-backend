// ==================== Auth Middleware ====================
// Protects routes by verifying JWT token and session validity

// JWT for token verification
import jwt from "jsonwebtoken";

// Redis Client
import { redisClient } from "../config/redisClient.js";

// Crypto for hashing tokens
import { generateToken } from "../utils/generateToken.js";
import { cryptoHash } from "../utils/generateHash.js";

// Models for user and session
import User from "../models/User.js";
import Session from "../models/Token Models/Session.js";
import RefreshToken from "../models/Token Models/Refresh.js";

// Error handling utility
import ApiError from "../errors/Apierror.js";

// Status code constants
import { STATUS_CODES } from "../constants/statusCodes.js";

// Utility for cookie options
import { cookieOptions } from "../utils/utility.js";

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    const sessionToken = req.cookies?.loginToken || req.cookies?.token;
    const refreshToken = req.cookies?.refreshToken;

    // 1. If neither token is present, return unauthorized
    if (!sessionToken && !refreshToken)
      return next(
        new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          "Not authorized. No tokens provided. Please login again.",
          ""
        )
      );

    // 2. If session token is present
    if (sessionToken) {
      try {
        const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
        const hashedToken = cryptoHash(sessionToken);

        // Old code - with mongo
        // const session = await Session.findOne({ token: hashedToken });
        // if (!session)
        //   return next(
        //     new ApiError(
        //       STATUS_CODES.UNAUTHORIZED,
        //       "Session not found. Please login again.",
        //       ""
        //     )
        //   );

        // New code - with Redis
        const sessionUserId = await redisClient.get(`session:${hashedToken}`);
        if (!sessionUserId)
          return next(
            new ApiError(
              STATUS_CODES.UNAUTHORIZED,
              "Session not found or expired. Please login again"
            )
          );

        const user = await User.findById(decoded.id).select("-password");
        if (!user)
          return next(
            new ApiError(STATUS_CODES.UNAUTHORIZED, "User not found.", "")
          );

        req.user = user;
        return next();
      } catch (error) {
        if (!refreshToken)
          return next(
            new ApiError(
              STATUS_CODES.UNAUTHORIZED,
              "Session expired or invalid. Please login again.",
              ""
            )
          );
      }
    }

    // 3. If refresh token is present (and session token is invalid/missing)
    if (refreshToken) {
      try {
        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        const hashedRefreshToken = cryptoHash(refreshToken);

        // Old code - refresh with mongo
        // const refresh = await RefreshToken.findOne({
        //   token: hashedRefreshToken,
        // });
        // if (!refresh)
        //   return next(
        //     new ApiError(
        //       STATUS_CODES.UNAUTHORIZED,
        //       "Invalid or expired refresh token found. Please login again.",
        //       ""
        //     )
        //   );

        // New code - refresh with redis
        const refreshUserId = await redisClient.get(
          `refresh:${hashedRefreshToken}`
        );
        if (!refreshUserId)
          return next(
            new ApiError(
              STATUS_CODES.UNAUTHORIZED,
              "Invalid or expired refresh token. Please login again."
            )
          );

        const user = await User.findById(decodedRefresh.id).select("-password");
        if (!user)
          return next(
            new ApiError(STATUS_CODES.UNAUTHORIZED, "User not found.", "")
          );

        // Generate new session token and save in db
        const newSessionToken = generateToken(user._id);
        const hashedNewSessionToken = cryptoHash(newSessionToken);

        // Old code - mongo
        // await Session.create({ user: user._id, token: hashedNewSessionToken });

        // New code - redis
        await redisClient.setEx(
          `session:${hashedNewSessionToken}`,
          60 * 60 * 24, // 24 hours
          user._id.toString()
        );

        // Set new session token in cookies
        res.cookie("loginToken", newSessionToken, cookieOptions("24hr"));

        req.user = user;

        return next();
      } catch (error) {
        return next(
          new ApiError(
            STATUS_CODES.UNAUTHORIZED,
            "Invalid or expired refresh token. Please login again.",
            ""
          )
        );
      }
    }
  } catch (error) {
    return next(
      new ApiError(STATUS_CODES.UNAUTHORIZED, "Authentication failed", "")
    );
  }
};

export default protect;
