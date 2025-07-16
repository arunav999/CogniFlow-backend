// ==================== Register User Validator ====================
// Validates registration request body for required fields and correct format

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Status code constants, roles, and regex
import { STATUS_CODES } from "../../constants/statusCodes.js";
import { ROLES } from "../../constants/roles.js";
import { REGX } from "../../constants/regx.js";

// Middleware to validate register user input
const registerUserValidator = (req, res, next) => {
  // Extract registration fields from request body
  const {
    firstName,
    lastName = "",
    email,
    password,
    confirmPassword,
    role,
    company,
    inviteCode,
  } = req.body;

  // Presence check: first name
  if (!firstName)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "First name is required",
        "firstName"
      )
    );

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

  // Presence check: confirm password
  if (!confirmPassword)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Confirm password is required",
        "confirmPassword"
      )
    );

  // Presence check: role
  if (!role)
    return next(
      new ApiError(STATUS_CODES.BAD_REQUEST, "Role is required", "role")
    );

  // Password match check
  if (password.trim() !== confirmPassword.trim())
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Passwords do not match",
        "confirmPassword"
      )
    );

  // ===== CONTENT VALIDATION =====
  let firstNameSanitized = firstName.trim();
  let lastNameSanitized = lastName.trim();
  let emailSanitized = email.trim().toLowerCase();
  let passwordSanitized = password.trim();
  let companySanitized = company ? company.trim() : "";

  // check length
  if (firstNameSanitized.length < 3)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "First name must be atleast 3 characters",
        "firstName"
      )
    );

  if (lastNameSanitized.length > 0 && lastNameSanitized.length < 3)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Last name must be 3 characters",
        "lastName"
      )
    );

  if (emailSanitized.length < 5)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Email must be 5 characters",
        "email"
      )
    );

  if (companySanitized.length < 5)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Company must be 5 characters",
        "company"
      )
    );

  // Check only letters
  if (!REGX.NAME.test(firstNameSanitized))
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "First name must contain only letters (no numbers or symbols)",
        "firstName"
      )
    );

  if (lastNameSanitized.length > 0 && !REGX.NAME.test(lastNameSanitized))
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Last name must contain only letters (no numbers or symbols)",
        "lastName"
      )
    );

  if (!REGX.EMAIL.test(emailSanitized))
    return next(
      new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid email format", "email")
    );

  if (!REGX.PASSWORD.test(passwordSanitized))
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Password must be 8-15 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        "password"
      )
    );

  // Role Base
  if (role === ROLES.ADMIN && !company)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Company name is required for admin",
        "company"
      )
    );

  if ((role === ROLES.MANAGER || role === ROLES.DEVELOPER) && !inviteCode)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Invite code is required for workspace access",
        "inviteCode"
      )
    );

  // Capitalize first letter
  firstNameSanitized =
    firstNameSanitized.charAt(0).toUpperCase() +
    firstNameSanitized.slice(1).toLowerCase();

  lastNameSanitized =
    lastNameSanitized.charAt(0).toUpperCase() +
    lastNameSanitized.slice(1).toLowerCase();

  // Overwrite req.body
  req.body.firstName = firstNameSanitized;
  req.body.lastName = lastNameSanitized;
  req.body.email = emailSanitized;
  req.body.password = passwordSanitized;
  req.body.company = companySanitized;
  req.body.inviteCode = inviteCode?.trim();

  // Next middleware/controller
  next();
};

export default registerUserValidator;
