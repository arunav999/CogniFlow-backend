// Models
import User from "../../models/User";

// Error
import ApiError from "../../errors/Apierror.js";

// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";
import { REGX } from "../../constants/regx.js";

// ========== CHECK USER EXIST ==========
export const checkUserExist = async (req, res, next) => {
  const { email } = req.query;

  // check email
  if (!email)
    return next(
      new ApiError(STATUS_CODES.BAD_REQUEST, "Email is required", "email")
    );

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

  // Check existing user

  try {
    const existingUser = await User.findOne({ email: emailSanitized });

    if (existingUser) {
      return next(
        new ApiError(STATUS_CODES.CONFLICT, "Email already in use", "email")
      );
    }

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Email is available",
      field: "email",
    });
  } catch (error) {
    next(error);
  }
};
