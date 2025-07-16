// ==================== Verify Token Middleware ====================
// Verifies JWT token and session validity for protected routes

// JWT for token verification
import jwt from "jsonwebtoken";

// Crypto for hashing tokens
import crypto from "crypto";

// Session model
import Session from "../models/Token Models/Session.js";

// Error handling utility
import ApiError from "../errors/Apierror.js";

// Status code constants
import { STATUS_CODES } from "../constants/statusCodes.js";

// Middleware to verify token
export const verifyToken = async (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.token;
  if (!token)
    return next(new ApiError(STATUS_CODES.UNAUTHORIZED, "Unauthorized", ""));

  try {
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
          "Session expired or invalid",
          ""
        )
      );

    // Attach user ID to request object
    req.user = { _id: decoded.id };
    next();
  } catch (error) {
    next(new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid token", ""));
  }
};
