// ==================== Delete Attachment Controller ====================
// Handles deletion of an attachment from a ticket

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Cloudinary for file management
import { v2 as cloudinary } from "cloudinary";

// Models
import Ticket from "../../models/Ticket.js";
import Project from "../../models/Project.js";

// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Roles Constants
import { ROLE_PERMISSIONS } from "../../constants/roleDefinitions.js";

export const deleteAttachmentController = async (req, res, next) => {
  // Extract user role from request
  const userRole = req.user.role;

  // Extract ticket ID from request
  const ticketId = req.params.id;

  try {
    // Check user role permissions
    if (!ROLE_PERMISSIONS[userRole]?.canManageTickets)
      return next(
        new ApiError(
          STATUS_CODES.FORBIDDEN,
          "You are not authorized to delete tickets",
          ""
        )
      );

    const ticket = await Ticket.findById(ticketId);
    if (!ticket)
      return next(new ApiError(STATUS_CODES.NOT_FOUND, "Ticket not found", ""));

    // Delete cloudinary files
    const fileAttachments = ticket.attachments.filter(
      (att) => att.type === "file"
    );

    for (const file of fileAttachments) {
      const publicId = file.url.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(`tickets/${ticketId}/${publicId}`);
    }

    // Remove ticket from related projects
    await Project.updateOne(
      { _id: ticket.relatedProject },
      { $pull: { tickets: ticket._id } }
    );

    // Delete the ticket
    await Ticket.findByIdAndDelete(ticketId);

    // Respond with success message
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Ticket and attachments deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};
