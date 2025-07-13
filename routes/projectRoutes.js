import { Router } from "express";

// Protect
import protect from "../middlewares/authMiddleware.js";

// Validations
import { createProjectValidator } from "../validations/Projects/createProjectValidator.js";

// Controllers
import { createProjectController } from "../controllers/Projects/createProjectController.js";
import {
  getAllProjectsController,
  getProjectByIdController,
} from "../controllers/Projects/getProjectController.js";
import { patchProjectByIdController } from "../controllers/Projects/patchProjectController.js";
import { deleteProjectByIdController } from "../controllers/Projects/deleteProjectController.js";

const router = Router();

// ========== ROUTES ==========
// Create project
router.post("/", protect, createProjectValidator, createProjectController);

// Get all projects
router.get("/", protect, getAllProjectsController);

// Get project by id
router.get("/:id", protect, getProjectByIdController);

// Patch project
router.patch(
  "/:id",
  protect,
  createProjectValidator,
  patchProjectByIdController
);

// Delete project by id
router.delete("/:id", protect, deleteProjectByIdController);

export default router;
