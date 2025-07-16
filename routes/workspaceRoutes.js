// ==================== Workspace Routes ====================
// Handles CRUD operations for workspaces and membership
import { Router } from "express";

// ==================== Middleware ====================
// Protect workspace routes with authentication
import protect from "../middlewares/authMiddleware.js";

// ==================== Validators ====================
// Validate workspace creation and update requests
import { createWorkspaceValidator } from "../validations/Workspace/createWorkspaceValidator.js";

// ==================== Controllers ====================
// Controller functions for each workspace endpoint
import { createWorkspaceController } from "../controllers/Workspaces/createWorkspaceController.js";
import {
  getAllWorkspaces,
  getWorkspaceById,
} from "../controllers/Workspaces/getWorkspaceController.js";
import { patchWorkspaceById } from "../controllers/Workspaces/patchWorkspaceController.js";
import { deleteWorkspaceById } from "../controllers/Workspaces/deleteWorkspace.js";

// Create a new router instance
const router = Router();

// ==================== Route Definitions ====================
// Create a new workspace
router.post("/", protect, createWorkspaceValidator, createWorkspaceController);

// Get all workspaces for the authenticated user
router.get("/", protect, getAllWorkspaces);

// Get a specific workspace by its ID
router.get("/:id", protect, getWorkspaceById);

// Update a workspace by its ID
router.patch("/:id", protect, createWorkspaceValidator, patchWorkspaceById);

// Delete a workspace by its ID
router.delete("/:id", protect, deleteWorkspaceById);

// Export the router for use in the main server
export default router;
