// ==================== Auth Routes ====================
// Handles user authentication, registration, login, and profile endpoints
import { Router } from "express";

// ==================== Middleware ====================
// Protect routes with authentication middleware
import protect from "../middlewares/authMiddleware.js";
// Rate limiter middleware to prevent abuse
import rateLimitMiddleware from "../middlewares/rateLimiter.js";

// ==================== Validators ====================
// Validate registration and login requests
import validateRegisterUser from "../validations/Auth/registerUserValidator.js";
import validateLoginUser from "../validations/Auth/loginUserValidator.js";

// ==================== Controllers ====================
// Controller functions for each auth endpoint
import { registerUser } from "../controllers/Auth/registerController.js";
import { loginUser } from "../controllers/Auth/loginController.js";
import { checkUserExist } from "../controllers/Auth/checkUserEmailController.js";
import { getUser, getUserById } from "../controllers/Auth/getUserController.js";
import { logoutUser } from "../controllers/Auth/logoutUserController.js";

// Create a new router instance
const router = Router();

// ==================== Route Definitions ====================
// Register a new user
router.post("/register", validateRegisterUser, registerUser);

// Login an existing user
router.post("/login", rateLimitMiddleware, validateLoginUser, loginUser);

// Check if a user email exists
router.get("/check-email", checkUserExist);

// Get the authenticated user's profile
router.get("/getUser", protect, getUser);

// Get user by id
router.get("/getUser/:id", protect, getUserById);

// Logout the authenticated user
router.post("/logout", protect, logoutUser);

// Export the router for use in the main server
export default router;
