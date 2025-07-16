// ==================== Delete Ticket Controller ====================
// Handles deletion of a ticket and removes its reference from projects

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Project from "../../models/Project.js";
import Ticket from "../../models/Ticket.js";

// Main deleteTicketByIdController function
export const deleteTicketByIdController = async (req, res, next) => {
  // Extract user and ticket IDs from request
  const userId = req.user._id;
  const ticketId = req.params.id;

  try {
    // Validate ticket existence
    const findTicket = await Ticket.findById(ticketId);
    if (!findTicket)
      return next(new ApiError(STATUS_CODES.NOT_FOUND, "No ticket found", ""));

    // TODO: Cascade delete related comments if needed

    // Remove ticket reference from all projects
    await Project.updateMany(
      { tickets: ticketId },
      { $pull: { tickets: ticketId } }
    );

    // Delete the ticket from database
    await Ticket.findByIdAndDelete(ticketId);

    // Respond with success message
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Ticket and related data deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
