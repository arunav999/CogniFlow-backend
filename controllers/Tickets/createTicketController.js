// ==================== Create Ticket Controller ====================
// Handles creation of a new ticket and adds it to the specified project

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Roles Constants
import { ROLE_PERMISSIONS } from "../../constants/roleDefinitions.js";

// Models
import Workspace from "../../models/Workspace.js";
import Project from "../../models/Project.js";
import Ticket from "../../models/Ticket.js";

// Main createTicketController function
export const createTicketController = async (req, res, next) => {
  // Extract user ID from request
  const userId = req.user._id;

  // Destructure ticket details from request body
  const {
    workspaceId,
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
    // Check user role permissions
    const userRole = req.user.role;
    if (!ROLE_PERMISSIONS[userRole]?.canManageTickets)
      return next(
        new ApiError(
          STATUS_CODES.FORBIDDEN,
          "You are not authorized to create tickets",
          ""
        )
      );

    // Find the workspace by ID
    const findWorkspace = await Workspace.findById(workspaceId);
    if (!findWorkspace)
      return next(
        new ApiError(STATUS_CODES.NOT_FOUND, "Workspace not found", "")
      );

    // Find the project to associate with the ticket
    const findProject = await Project.findById(projectId);
    if (!findProject)
      return next(new ApiError(STATUS_CODES.NOT_FOUND, "Project not found", ""));

    // Check if ticket already exists in the project
    const existingTicket = await Ticket.findOne({
      ticketTitle,
      relatedProject: projectId,
    });
    if (existingTicket)
      return next(
        new ApiError(
          STATUS_CODES.CONFLICT,
          "This ticket already exists in this project",
          ""
        )
      );

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
      workspaceRef: workspaceId,
      tasks: tasks || [],
    });

    // Get new ticket ID
    const newTicketId = newTicket._id;

    // Add ticket to project's tickets array
    await Project.updateOne(
      { _id: projectId },
      { $addToSet: { tickets: newTicketId } }
    );

    // Send response
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "Ticket created successfully",
      workspaceRef: newTicket.workspaceRef,
      projectRef: newTicket.relatedProject,
      ticketDetails: {
        id: newTicketId,
        status: newTicket.ticketStatus,
        type: newTicket.ticketType,
        priority: newTicket.ticketPriority,
        title: newTicket.ticketTitle,
        description: newTicket.ticketDescription,
        deadline: newTicket.ticketDeadline,
        createdBy: newTicket.createdByUserId,
        assignedMembers: newTicket.assignedMembers,
        tasks: newTicket.tasks.map((task) => ({
          title: task.title,
          completed: task.completed,
        })),
        attachments: newTicket.attachments.map((item) => ({
          url: item.url,
          type: item.type,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
