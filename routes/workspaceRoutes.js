import { Router } from "express";

// Protect
import protect from "../middlewares/authMiddleware.js";

// Validations

// Controllers

const router = Router();

// ========== ROUTES ==========
// Create workspace
router.post("/", protect);

// Get workspace
router.get("/", protect);

// Get a workspace using id
router.get("/:id", protect);

// Update workspace using id
router.patch("/:id", protect);

// Delete workspace using id
router.delete("/:id", protect);

export default router;
