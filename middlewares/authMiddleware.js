// JWT
import jwt from "jsonwebtoken";

// Crypto
import crypto from "crypto";

// Models
import User from "../models/User.js";
import Session from "../models/Token Models/Session.js";

// Error
import ApiError from "../errors/Apierror.js";

// Constant
import { STATUS_CODES } from "../constants/statusCodes.js";

const protect = async (req, res, next) => {
  try {
    // Get cookies
    const token = req.cookies?.loginToken || req.cookies?.token;

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

    // Hash token to check db
    const hashedToken = crypto
      .createHash("sha3-256")
      .update(token)
      .digest("hex");

    // Checking session with db
    const session = await Session.findOne({ token: hashedToken });

    if (!session)
      return next(
        new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          "Session expired or invalid. Please login again",
          ""
        )
      );

    // Attach User
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
