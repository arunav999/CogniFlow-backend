// ==================== Invite Routes ====================
// Handles invite code creation, validation, and management
import { Router } from "express";

// ==================== Middleware ====================
// Protect routes with authentication middleware
import protect from "../middlewares/authMiddleware";
// Rate limiter middleware to prevent abuse
import rateLimitMiddleware from "../middlewares/rateLimiter";

// ==================== Validators ====================
// Validate invite code creation requests
// TODO: Implement validation for invite code creation

// ===================== Controllers ====================
// Controller functions for invite code endpoints
// TODO: Implement invite code controller functions

// Create a new router instance
const router = Router();

// ==================== Route Definitions ====================
// Create a new invite code
router.post("/generate", protect, rateLimitMiddleware);

// Accept an invite code
router.post("/accept", protect, rateLimitMiddleware);
