// ==================== Check User Email Controller ====================
// Checks if a user email exists and validates email format

// User model for lookup
import User from "../../models/User.js";

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Constants for status codes and regex
import { STATUS_CODES } from "../../constants/statusCodes.js";
import { REGX } from "../../constants/regx.js";

// Main checkUserExist controller
export const checkUserExist = async (req, res, next) => {
  const { email } = req.query;

  // Validate presence of email
  if (!email)
    return next(
      new ApiError(STATUS_CODES.BAD_REQUEST, "Email is required", "email")
    );

  // Sanitize and validate email format
  let emailSanitized = email.trim().toLowerCase();
  if (emailSanitized.length < 5)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Email must be 5 characters",
        "email"
      )
    );
  if (!REGX.EMAIL.test(emailSanitized))
    return next(
      new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid email format", "email")
    );

  // Check if user already exists
  try {
    const existingUser = await User.findOne({ email: emailSanitized });
    if (existingUser) {
      return next(
        new ApiError(STATUS_CODES.CONFLICT, "Email already in use", "email")
      );
    }

    // Respond with email availability
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Email is available",
      field: "email",
    });
  } catch (error) {
    next(error);
  }
};
