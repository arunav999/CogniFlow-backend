import { Router } from "express";

// Protect
import protect from "../middlewares/authMiddleware.js";

// Validate new user
import validateRegisterUser from "../validations/registerUserValidator.js";
import validateLoginUser from "../validations/loginUserValidator.js";

// Controllers
import { registerUser } from "../controllers/Auth/registerController.js";
import { loginUser } from "../controllers/Auth/loginController.js";
import { checkUserExist } from "../controllers/Auth/checkUserEmailController.js";
import { getUser } from "../controllers/Auth/getUserController.js";
import { logoutUser } from "../controllers/Auth/logoutUserController.js";

const router = Router();

// ========== ROUTES ==========
// Register route
router.post("/register", validateRegisterUser, registerUser);

// Login route
router.post("/login", validateLoginUser, loginUser);

// check-email
router.get("/check-email", checkUserExist);

// Get user route
router.get("/getUser", protect, getUser);

// Logout user route
router.post("/logout", protect, logoutUser);

export default router;
