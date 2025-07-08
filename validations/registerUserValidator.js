import ApiError from "../errors/Apierror";
import { STATUS_CODES } from "../constants/statusCodes";
import { ROLES } from "../constants/roles";

const validateRegisterUser = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    role,
    company,
    inviteCode,
  } = req.body;

  // name regx
  const nameRegex = /^[a-zA-Z]+$/;

  // email regx
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Simple password strength: min 8 chars, max 15 chars, at least 1 number, 1 uppercase, 1 lowercase, 1 specialChar
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/;

  // ===== PRESENSE CHECK =====
  // first name
  if (!firstName)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "First name is required",
      "firstName"
    );

  // last name
  if (!lastName)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Last name is required",
      "lastName"
    );

  // password
  if (!password)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Password is required",
      "password"
    );

  // confirm-password
  if (!confirmPassword)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Confirm password is required",
      "confirmPassword"
    );

  // role
  if (!role)
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Role is required", "role");

  // check password
  if (password.trim() !== confirmPassword.trim())
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Passwords do not match",
      "confirmPassword"
    );

  // ===== CONTENT VALIDATION =====
  let firstNameSanitized = firstName.trim();
  let lastNameSanitized = lastName.trim();
  let emailSanitized = email.trim().toLowerCase();
  let passwordSanitized = password.trim();
  let companySanitized = company ? company.trim() : "";

  // check length
  if (firstNameSanitized.length < 3)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "First name must be atleast 3 characters",
      "firstName"
    );

  if (lastNameSanitized.length < 3)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Last name must be 3 characters",
      "lastName"
    );

  if (emailSanitized.length < 5)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Email must be 5 characters",
      "email"
    );

  if (companySanitized.length < 5)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Company must be 5 characters",
      "company"
    );

  // Check only letters
  if (!nameRegex.test(firstNameSanitized))
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "First name must contain only letters (no numbers or symbols)",
      "firstName"
    );

  if (!nameRegex.test(lastNameSanitized))
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Last name must contain only letters (no numbers or symbols)",
      "lastName"
    );

  if (!emailRegex.test(emailSanitized))
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Invalid email format",
      "email"
    );

  if (!passwordRegex.test(passwordSanitized))
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Password must be 8-15 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "password"
    );

  // Role Base
  if (role === ROLES.ADMIN && !company)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Company name is required for admin",
      "company"
    );

  if ((role === ROLES.MANAGER || role === ROLES.DEVELOPER) && !inviteCode)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Invite code is required for workspace access",
      "inviteCode"
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

  next();
};

export default validateRegisterUser;
