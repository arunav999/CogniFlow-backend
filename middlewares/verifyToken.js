import jwt from "jsonwebtoken";

import ApiError from "../errors/Apierror";
import { STATUS_CODES } from "../constants/statusCodes";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return next(new ApiError(STATUS_CODES.UNAUTHORIZED, "Unauthorized", ""));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id };
    next();
  } catch (error) {
    next(new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid token", ""));
  }
};
