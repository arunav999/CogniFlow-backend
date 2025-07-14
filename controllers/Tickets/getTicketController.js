// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Ticket from "../../models/Ticket.js";

/* === GET ALL TICKETS - THAT BELONGS TO A PROJECT === */
export const getAllTicketsController = async (req, res, next) => {
  try {
    // Get project
    const { projectId } = req.body;

    // === Find All: Tickets that belongs to that project
    const getAllTickets = await Ticket.find({ relatedProject: projectId });

    // if no ticket
    if (getAllTickets.length === 0)
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No tickets created for this project",
      });

    // response
    res.status(STATUS_CODES.OK).json({
      success: true,
      tickets: getAllTickets.map((ticket) => ({
        id: ticket._id,
        projectRef: ticket.relatedProject,
        status: ticket.ticketStatus,
        type: ticket.ticketType,
        priority: ticket.ticketPriority,
        title: ticket.ticketTitle,
        description: ticket.ticketDescription,
        attachments: ticket.attachments.map((image) => ({ url: image })),
        createdBy: ticket.createdByUserId,
        updatedBy: ticket.updatedByUserId,
        assignedMembers: ticket.assignedMembers.map((member) => ({ member })),
        tasks: ticket.tasks.map((task) => ({ task })),
        comments: ticket.comments.map((comment) => comment),
      })),
    });
  } catch (error) {
    next(error);
  }
};

/* === GET A SINGLE TICKET - THAT BELONGS TO A PROJECT WITH TICKET ID === */
export const getTicketByIdController = async (req, res, next) => {
  try {
    const ticketId = req.params.id;

    // Find ticket
    const findTicket = await Ticket.findById(ticketId);

    // If no ticket
    if (!findTicket)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No ticket found" });

    // response
    res.status(STATUS_CODES.OK).json({
      success: true,
      ticket: {
        id: ticketId,
        projectRef: findTicket.relatedProject,
        status: findTicket.ticketStatus,
        type: findTicket.ticketType,
        priority: findTicket.ticketPriority,
        title: findTicket.ticketTitle,
        description: findTicket.ticketDescription,
        attachments: findTicket.attachments.map((image) => ({ url: image })),
        createdBy: findTicket.createdByUserId,
        updatedBy: findTicket.updatedByUserId,
        assignedMembers: findTicket.assignedMembers.map((member) => ({
          member,
        })),
        tasks: findTicket.tasks.map((task) => ({
          title: task.title,
          completed: task.completed,
        })),
        comments: findTicket.comments.map((comment) => comment),
      },
    });
  } catch (error) {
    next(error);
  }
};
