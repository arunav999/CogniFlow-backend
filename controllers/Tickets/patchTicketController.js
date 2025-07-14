// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Project from "../../models/Project.js";
import Ticket from "../../models/Ticket.js";

export const patchTicketByIdController = async (req, res, next) => {
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
    tasks,
  } = req.body;
  const ticketId = req.params.id;

  try {
    const findProject = await Project.findById(projectId);
    const findTicket = await Ticket.findById(ticketId);

    // If no project
    if (!findProject)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No project found" });

    // If no ticket
    if (!findTicket)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No ticket found" });

    // Update ticket
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

    // response
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
        attachments: updateTicket.attachments.map((image) => ({ url: image })),
        createdBy: updateTicket.createdByUserId,
        updatedBy: updateTicket.updatedByUserId,
        assignedMembers: updateTicket.assignedMembers.map((member) => ({
          member,
        })),
        tasks: updateTicket.tasks.map((task) => ({
          title: task.title,
          completed: task.completed,
        })),
        comments: updateTicket.comments.map((comment) => comment),
      },
    });
  } catch (error) {
    next(error);
  }
};
