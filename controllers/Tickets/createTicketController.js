// Error
import ApiError from "../../errors/Apierror.js";

// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Project from "../../models/Project.js";
import Ticket from "../../models/Ticket.js";

export const createTicketController = async (req, res, next) => {
  const userId = req.user._id;

  const {
    projectId,
    ticketStatus,
    ticketType,
    ticketPriority,
    ticketTitle,
    ticketDescription,
    ticketDeadline,
    attachments,
  } = req.body;

  try {
    // Create new ticket
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
    });

    // Update ticket
    const newTicketId = newTicket._id;

    // find project
    const findProject = await Project.findById(projectId);
    // if no project
    if (!findProject)
      throw new ApiError(STATUS_CODES.NOT_FOUND, "Project not found", "");

    // check if ticket already a part of worksapce
    if (findProject.tickets.includes(newTicketId))
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        "This ticket already exists in this project",
        ""
      );

    // if not a part
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
        attachments: newTicket.attachments.map((image) => ({ url: image })),
        createdBy: newTicket.createdByUserId,
        assignmedMembers: newTicket.assignedMembers,
        relatedProject: newTicket.relatedProject,
        tasks: newTicket.tasks,
        comments: newTicket.comments,
      },
    });
  } catch (error) {
    next(error);
  }
};
