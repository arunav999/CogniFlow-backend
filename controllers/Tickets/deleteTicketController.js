// Error
import ApiError from "../../errors/Apierror.js";

// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Project from "../../models/Project.js";
import Ticket from "../../models/Ticket.js";

export const deleteTicketByIdController = async (req, res, next) => {
  const userId = req.user._id;
  const ticketId = req.params.id;

  try {
    // === Validation: Check if ticket exists ===
    const findTicket = await Ticket.findById(ticketId);
    // if no ticket
    if (!findTicket)
      return new ApiError(STATUS_CODES.NOT_FOUND, "No ticket found", "");

    // === Cascade delete: Remove all related comments ===

    // === Remove ticket reference from project ===
    await Project.updateMany(
      { tickets: ticketId },
      { $pull: { tickets: ticketId } }
    );

    // === Delete project ===
    await Ticket.findByIdAndDelete(ticketId);

    // === Response ===
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Ticket and related data deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
