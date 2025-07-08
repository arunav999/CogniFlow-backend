import { Router } from "express";

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
router.get("/getUser", (req, res) => res.send("Get user not implemented"));

export default router;
