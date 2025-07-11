// JWT
import jwt from "jsonwebtoken";

// Crypto
import crypto from "crypto";

// Models
import Session from "../models/Token Models/Session.js";

// Error
import ApiError from "../errors/Apierror.js";

// Constants
import { STATUS_CODES } from "../constants/statusCodes.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return next(new ApiError(STATUS_CODES.UNAUTHORIZED, "Unauthorized", ""));

  try {
    // Verify JWT Signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Hash token to check db
    const hashedToken = crypto.createHash("sha3-256").update(token).digest("hex");

    // Check db
    const session = await Session.findOne({ token: hashedToken });

    if (!session)
      return next(
        new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          "Session expired or invalid",
          ""
        )
      );

    // Attach user to req
    req.user = { _id: decoded.id };
    next();
  } catch (error) {
    next(new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid token", ""));
  }
};
