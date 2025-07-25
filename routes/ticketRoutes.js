// ==================== Ticket Routes ====================
// Handles CRUD operations for tickets and their attachments
import { Router } from "express";

// ==================== Middleware ====================
// Protect ticket routes with authentication
import protect from "../middlewares/authMiddleware.js";

// ==================== Validators ====================
// Validate ticket creation and update requests
import { createTicketValidator } from "../validations/Tickets/createTicketValidation.js";

// ==================== Upload Config ====================
// Multer config for handling file uploads
import { upload } from "./uploadRoutes.js";

// ==================== Controllers ====================
// Controller functions for each ticket endpoint
import { createTicketController } from "../controllers/Tickets/createTicketController.js";
import * as TicketGetControllers from "../controllers/Tickets/getTicketController.js";
import { patchTicketByIdController } from "../controllers/Tickets/patchTicketController.js";
import { deleteTicketByIdController } from "../controllers/Tickets/deleteTicketController.js";

// ==================== Attachments Controllers ====================
// Controller functions for ticket attachments
import { patchAttachmentController } from "../controllers/Tickets/patchAttachmentController.js";
import { deleteAttachmentController } from "../controllers/Tickets/deleteAttachmentController.js";

// Create a new router instance
const router = Router();

// ==================== Route Definitions ====================
// Create a new ticket in a project
router.post(
  "/project/:pid",
  protect,
  createTicketValidator,
  createTicketController
);

// Get all tickets in a project
router.get(
  "/project/:pid",
  protect,
  TicketGetControllers.getAllTicketsController
);

// Update a ticket by its ID
router.patch("/:id", protect, createTicketValidator, patchTicketByIdController);

// Get a specific ticket by its ID
router.get("/:id", protect, TicketGetControllers.getTicketByIdController);

// Delete a ticket by its ID
router.delete("/:id", protect, deleteTicketByIdController);

// ==================== Attachment Routes ====================
// Add attachments to a ticket (files or links)
router.patch(
  "/:id/attachments",
  protect,
  upload.array("attachments", 5),
  patchAttachmentController
);

// Delete an attachment from a ticket
router.delete("/:id/:attachmentsId", protect, deleteAttachmentController);

// Export the router for use in the main server
export default router;
