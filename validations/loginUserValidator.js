// Error
import ApiError from "../errors/Apierror.js";

// Constants
import { STATUS_CODES } from "../constants/statusCodes.js";
import { REGX } from "../constants/regx.js";

const loginUserValidator = async (req, res, next) => {
  const { email, password } = req.body;

  // ===== PRESENSE CHECK =====
  // email
  if (!email)
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Email is required", "email");

  // password
  if (!password)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Password is required",
      "password"
    );

  // ===== CONTENT VALIDATION =====
  let emailSanitized = email.trim().toLowerCase();
  let passwordSanitized = password.trim();

  // check length
  if (emailSanitized.length < 5)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Email must be 5 characters",
      "email"
    );

  if (!REGX.EMAIL.test(emailSanitized))
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Invalid email format",
      "email"
    );

  // Overwrite req.body
  req.body.email = emailSanitized;
  req.body.password = passwordSanitized;
};

export default loginUserValidator;
