import { Router } from "express";

// Protect
import protect from "../middlewares/authMiddleware.js";

// Validate new user
import validateRegisterUser from "../validations/registerUserValidator.js";
import validateLoginUser from "../validations/loginUserValidator.js";

// Controllers
import { registerUser, loginUser } from "../controllers/authController.js";

// Models
import User from "../models/User.js";

// Error
import ApiError from "../errors/Apierror.js";

// Constants
import { STATUS_CODES } from "../constants/statusCodes.js";
import { REGX } from "../constants/regx.js";

const router = Router();

// ========== CHECK USER EXIST ==========
const checkUserExist = async (req, res, next) => {
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

// ========== ROUTES ==========
// Register route
router.post("/register", validateRegisterUser, registerUser);

// Login route
router.post("/login", validateLoginUser, loginUser);

// check-email
router.get("/check-email", checkUserExist);

// Get user route
router.get("/getUser", protect, (req, res, next) => {
  res.json({
    message: "Welcome to your dashboard",
    user: req.user,
  });
});

export default router;
