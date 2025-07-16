// ==================== Login User Validator ====================
// Validates login request body for required fields and correct format

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Status code constants and regex
import { STATUS_CODES } from "../../constants/statusCodes.js";
import { REGX } from "../../constants/regx.js";

// Middleware to validate login user input
const loginUserValidator = async (req, res, next) => {
  // Extract email and password from request body
  const { email, password } = req.body;

  // Presence check: email
  if (!email)
    return next(
      new ApiError(STATUS_CODES.BAD_REQUEST, "Email is required", "email")
    );

  // Presence check: password
  if (!password)
    return next(
      new ApiError(STATUS_CODES.BAD_REQUEST, "Password is required", "password")
    );

  // Content validation: sanitize and check length/format
  let emailSanitized = email.trim().toLowerCase();
  let passwordSanitized = password.trim();

  // Email length check
  if (emailSanitized.length < 5)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Email must be 5 characters",
        "email"
      )
    );

  // Email format check
  if (!REGX.EMAIL.test(emailSanitized))
    return next(
      new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid email format", "email")
    );

  // Overwrite req.body with sanitized values
  req.body.email = emailSanitized;
  req.body.password = passwordSanitized;

  // Proceed to next middleware/controller
  next();
};

export default loginUserValidator;
