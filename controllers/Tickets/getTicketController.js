// ==================== Get Ticket Controllers ====================
// Handles fetching all tickets for a project and fetching a single ticket by ID

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Ticket model
import Ticket from "../../models/Ticket.js";

// Get all tickets that belong to a project
export const getAllTicketsController = async (req, res, next) => {
  try {
    // Extract project ID from request body
    const { projectId } = req.body;

    // Find all tickets for the given project
    const getAllTickets = await Ticket.find({ relatedProject: projectId });

    // If no tickets found, respond with not found
    if (getAllTickets.length === 0)
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No tickets created for this project",
      });

    // Respond with ticket details
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
        tasks: ticket.tasks.map((task) => ({
          title: task.title,
          completed: task.completed,
        })),
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Get a single ticket by its ID
export const getTicketByIdController = async (req, res, next) => {
  try {
    // Extract ticket ID from request params
    const ticketId = req.params.id;

    // Find ticket by ID
    const findTicket = await Ticket.findById(ticketId);

    // If no ticket found, respond with not found
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
      },
    });
  } catch (error) {
    next(error);
  }
};
