// ==================== Project Routes ====================
// Handles CRUD operations for projects within workspaces
import { Router } from "express";

// ==================== Middleware ====================
// Protect project routes with authentication
import protect from "../middlewares/authMiddleware.js";

// ==================== Validators ====================
// Validate project creation and update requests
import { createProjectValidator } from "../validations/Projects/createProjectValidator.js";

// ==================== Controllers ====================
// Controller functions for each project endpoint
import { createProjectController } from "../controllers/Projects/createProjectController.js";
import {
  getAllProjectsController,
  getProjectByIdController,
} from "../controllers/Projects/getProjectController.js";
import { patchProjectByIdController } from "../controllers/Projects/patchProjectController.js";
import { deleteProjectByIdController } from "../controllers/Projects/deleteProjectController.js";

// Create a new router instance
const router = Router();

// ==================== Route Definitions ====================
// Create a new project in a workspace
router.post("/", protect, createProjectValidator, createProjectController);

// Get all projects in a workspace
router.get("/", protect, getAllProjectsController);

// Get a specific project by its ID
router.get("/:id", protect, getProjectByIdController);

// Update a project by its ID
router.patch(
  "/:id",
  protect,
  createProjectValidator,
  patchProjectByIdController
);

// Delete a project by its ID
router.delete("/:id", protect, deleteProjectByIdController);

// Export the router for use in the main server
export default router;
