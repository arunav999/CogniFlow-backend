// ==================== Patch Ticket Controller ====================
// Handles updating ticket details for a given ticket and project

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Workspace from "../../models/Workspace.js";
import Project from "../../models/Project.js";
import Ticket from "../../models/Ticket.js";

// Main patchTicketByIdController function
export const patchTicketByIdController = async (req, res, next) => {
  // Extract user ID and ticket details from request
  const userId = req.user._id;
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
  const ticketId = req.params.id;

  try {
    // Validate workspace and project existence
    const findWorkspace = await Workspace.findById(workspaceId);
    if (!findWorkspace)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No workspace found" });

    // Find project and ticket by their IDs
    const findProject = await Project.findById(projectId);
    const findTicket = await Ticket.findById(ticketId);

    // If project not found, respond with error
    if (!findProject)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No project found" });

    // If ticket not found, respond with error
    if (!findTicket)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No ticket found" });

    // Update ticket details
    const updateTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $set: {
          ticketStatus,
          ticketType,
          ticketPriority,
          ticketTitle,
          ticketDescription,
          ticketDeadline,
          attachments,
          updatedByUserId: userId,
          tasks: tasks || [],
        },
      },
      { new: true }
    );

    // Respond with updated ticket info
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Ticket updated successfully",
      updatedTicket: {
        id: ticketId,
        projectRef: updateTicket.relatedProject,
        status: updateTicket.ticketStatus,
        type: updateTicket.ticketType,
        priority: updateTicket.ticketPriority,
        title: updateTicket.ticketTitle,
        description: updateTicket.ticketDescription,
        createdBy: updateTicket.createdByUserId,
        updatedBy: updateTicket.updatedByUserId,
        assignedMembers: updateTicket.assignedMembers.map((member) => ({
          member,
        })),
        tasks: updateTicket.tasks.map((task) => ({
          title: task.title,
          completed: task.completed,
        })),
        attachments: updateTicket.attachments.map((item) => ({
          url: item.url,
          type: item.type,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
