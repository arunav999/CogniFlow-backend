// ==================== Delete Ticket Controller ====================
// Handles deletion of a ticket and removes its reference from projects

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Roles Constants
import { ROLE_PERMISSIONS } from "../../constants/roleDefinitions.js";

// Models
import Project from "../../models/Project.js";
import Ticket from "../../models/Ticket.js";

// Main deleteTicketByIdController function
export const deleteTicketByIdController = async (req, res, next) => {
  // Extract user and ticket IDs from request
  const ticketId = req.params.id;

  try {
    // Check user role permissions
    const userRole = req.user.role;
    if (!ROLE_PERMISSIONS[userRole]?.canManageTickets)
      return next(
        new ApiError(
          STATUS_CODES.FORBIDDEN,
          "You are not authorized to delete tickets",
          ""
        )
      );

    // Validate ticket existence
    const findTicket = await Ticket.findById(ticketId);
    if (!findTicket)
      return next(new ApiError(STATUS_CODES.NOT_FOUND, "No ticket found", ""));

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
