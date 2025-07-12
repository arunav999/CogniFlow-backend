import { Router } from "express";

// Protect
import protect from "../middlewares/authMiddleware.js";

// Validations
import { createWorkspaceValidator } from "../validations/Workspace/createWorkspaceValidator.js";

// Controllers
import { createWorkspaceController } from "../controllers/Workspaces/createWorkspaceController.js";
import {
  getAllWorkspaces,
  getWorkspaceById,
} from "../controllers/Workspaces/getWorkspaceController.js";
import { patchWorkspaceById } from "../controllers/Workspaces/patchWorkspaceController.js";

const router = Router();

// ========== ROUTES ==========
// Create workspace
router.post("/", protect, createWorkspaceValidator, createWorkspaceController);

// Get workspace
router.get("/", protect, getAllWorkspaces);

// Get a workspace using id
router.get("/:id", protect, getWorkspaceById);

// Update workspace using id
router.patch("/:id", protect, createWorkspaceValidator, patchWorkspaceById);

// Delete workspace using id
router.delete("/:id", protect);

export default router;
