// ==================== Dashboard Routes ====================
// Sends dashboard data based on role endpoints
import { Router } from "express";

// ==================== Middleware ====================
// Protect routes with authentication middleware
import protect from "../middlewares/authMiddleware.js";

// ==================== Controllers ====================
// Controller functions for each dashboard endpoint
import { adminDashboardController } from "../controllers/Dashboard/adminDashboardController.js";
import { managerDashboardController } from "../controllers/Dashboard/managerDashboardController.js";
import { developerDashboardController } from "../controllers/Dashboard/developerDashboardController.js";

// Create a new router instance
const router = Router();

// ==================== Route Definitions ====================
// Get Admin Dashboard details
router.get("/admin", protect, adminDashboardController);

// Get Manager Dashboard details
router.get("/manager", protect, managerDashboardController);

// Get Developer Dashboard details
router.get("/developer", protect, developerDashboardController);

// Export the router for use in the main server
export default router;
