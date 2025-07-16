// ==================== Create Ticket Controller ====================
// Handles creation of a new ticket and adds it to the specified project

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Project from "../../models/Project.js";
import Ticket from "../../models/Ticket.js";

// Main createTicketController function
export const createTicketController = async (req, res, next) => {
  // Extract user ID from request
  const userId = req.user._id;

  // Destructure ticket details from request body
  const {
    projectId,
    ticketStatus,
    ticketType,
    ticketPriority,
    ticketTitle,
    ticketDescription,
    ticketDeadline,
    attachments,
    tasks,
  } = req.body;

  try {
    // Create new ticket document
    const newTicket = await Ticket.create({
      ticketStatus,
      ticketType,
      ticketPriority,
      ticketTitle,
      ticketDescription,
      ticketDeadline,
      attachments,
      createdByUserId: userId,
      relatedProject: projectId,
      tasks: tasks || [],
    });

    // Get new ticket ID
    const newTicketId = newTicket._id;

    // Find the project to associate with the ticket
    const findProject = await Project.findById(projectId);
    if (!findProject)
      throw new ApiError(STATUS_CODES.NOT_FOUND, "Project not found", "");

    // Check if ticket already exists in the project
    if (findProject.tickets.includes(newTicketId))
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        "This ticket already exists in this project",
        ""
      );

    // Add ticket to project's tickets array
    await Project.updateOne(
      { _id: projectId },
      { $addToSet: { tickets: newTicketId } }
    );

    // Send response
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "Ticket created successfully",
      ticketDetails: {
        id: newTicketId,
        status: newTicket.ticketStatus,
        type: newTicket.ticketType,
        priority: newTicket.ticketPriority,
        title: newTicket.ticketTitle,
        description: newTicket.ticketDescription,
        deadline: newTicket.ticketDeadline,
        createdBy: newTicket.createdByUserId,
        assignmedMembers: newTicket.assignedMembers,
        relatedProject: newTicket.relatedProject,
        tasks: newTicket.tasks.map((task) => ({
          title: task.title,
          completed: task.completed,
        })),
        attachments: newTicket.attachments.map((item) => ({
          url: item.url,
          type: item.type,
        })),
        uploadedAt: newTicket.uploadedAt,
        uploadedBy: newTicket.uploadedBy,
      },
    });
  } catch (error) {
    next(error);
  }
};
