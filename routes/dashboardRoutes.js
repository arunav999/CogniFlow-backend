// ==================== Dashboard Routes ====================
// Sends dashboard data based on role endpoints
import { Router } from "express";

// ==================== Middleware ====================
// Protect routes with authentication middleware
import protect from "../middlewares/authMiddleware.js";

// ==================== Controllers ====================
// Controller functions for dashboard endpoint
import { dashboardController } from "../controllers/Dashboard/dashboardController.js";

// Create a new router instance
const router = Router();

// ==================== Route Definitions ====================
// Get All Dashboard details based on user.role
router.get("/", protect, dashboardController);

// Export the router for use in the main server
export default router;
