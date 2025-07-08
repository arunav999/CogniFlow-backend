import { Router } from "express";

// Validate new user
import validateRegisterUser from "../validations/registerUserValidator.js";

// Controllers
import { registerUser, loginUser } from "../controllers/authController.js";

const router = Router();

// Register route
router.post("/register", validateRegisterUser, registerUser);

// TODO: Add actual handlers later
router.post("/login", (req, res) => res.send("Login not implemented"));
router.get("/getUser", (req, res) => res.send("Get user not implemented"));

export default router;
