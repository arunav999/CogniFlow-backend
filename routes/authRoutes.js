import { Router } from "express";

// Protect
import protect from "../middlewares/authMiddleware.js";

// Validate new user
import validateRegisterUser from "../validations/registerUserValidator.js";
import validateLoginUser from "../validations/loginUserValidator.js";

// Controllers
import { registerUser, loginUser } from "../controllers/authController.js";

const router = Router();

// Register route
router.post("/register", validateRegisterUser, registerUser);

// Login route
router.post("/login", validateLoginUser, loginUser);

// Get user route
router.get("/getUser", protect, (req, res, next) => {
  res.json({
    message: "Welcome to your dashboard",
    user: req.user,
  });
});

export default router;
