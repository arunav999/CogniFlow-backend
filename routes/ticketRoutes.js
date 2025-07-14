import { Router } from "express";

// Protect
import protect from "../middlewares/authMiddleware.js";

// Validations
import { createTicketValidator } from "../validations/Tickets/createTicketValidation.js";

// Controllers
import { createTicketController } from "../controllers/Tickets/createTicketController.js";
import {
  getAllTicketsController,
  getTicketByIdController,
} from "../controllers/Tickets/getTicketController.js";
import { patchTicketByIdController } from "../controllers/Tickets/patchTicketController.js";
import { deleteTicketByIdController } from "../controllers/Tickets/deleteTicketController.js";

const router = Router();

// ========== ROUTES ==========
// Create ticket
router.post("/", protect, createTicketValidator, createTicketController);

// Get all tickets
router.get("/", protect, getAllTicketsController);

// Get ticket by id
router.get("/:id", protect, getTicketByIdController);

// Patch ticket
router.patch("/:id", protect, createTicketValidator, patchTicketByIdController);

// Delete ticket
router.delete("/:id", protect, deleteTicketByIdController);

export default router;
