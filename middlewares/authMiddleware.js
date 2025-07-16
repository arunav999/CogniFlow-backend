// ==================== Auth Middleware ====================
// Protects routes by verifying JWT token and session validity

// JWT for token verification
import jwt from "jsonwebtoken";

// Crypto for hashing tokens
import crypto from "crypto";

// Models for user and session
import User from "../models/User.js";
import Session from "../models/Token Models/Session.js";

// Error handling utility
import ApiError from "../errors/Apierror.js";

// Status code constants
import { STATUS_CODES } from "../constants/statusCodes.js";

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies?.loginToken || req.cookies?.token;

    // If no token, deny access
    if (!token)
      return next(
        new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          "Not authorized. No token found.",
          ""
        )
      );

    // Verify JWT signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Hash token for session lookup
    const hashedToken = crypto
      .createHash("sha3-256")
      .update(token)
      .digest("hex");

    // Check session validity in database
    const session = await Session.findOne({ token: hashedToken });

    if (!session)
      return next(
        new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          "Session expired or invalid. Please login again",
          ""
        )
      );

    // Attach user to request object
    const user = await User.findById(decoded.id).select("-password");

    if (!user)
      return next(
        new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          "Not authorized. No user found",
          ""
        )
      );

    req.user = user;
    next();
  } catch (error) {
    return next(
      new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        "Not authorized. Invalid token.",
        ""
      )
    );
  }
};

export default protect;
