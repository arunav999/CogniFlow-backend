import { Router } from "express";

// Protect
import protect from "../middlewares/authMiddleware.js";

// Validations

// Controllers

const router = Router();

// ========== ROUTES ==========
// Create workspace
router.post("/create-workspace", protect);

// Get workspace
router.get("/get-workspace", protect);

// Update workspace
router.patch("/update-workspace", protect);

// Delete workspace
router.delete("/delete-workspace", protect);

export default router;
