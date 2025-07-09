import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Session from "../models/Auth Models/Session.js";

import ApiError from "../errors/Apierror.js";
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

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
