// ==================== Delete Project Controller ====================
// Handles deletion of a project and updates the workspace

// Clouidinary
import { v2 as cloudinary } from "cloudinary";

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Roles Constants
import { ROLES } from "../../constants/roles.js";
import { ROLE_PERMISSIONS } from "../../constants/roleDefinitions.js";

// Models for workspace, project and Ticket
import Workspace from "../../models/Workspace.js";
import Project from "../../models/Project.js";
import Ticket from "../../models/Ticket.js";

// Main deleteProjectById controller
export const deleteProjectByIdController = async (req, res, next) => {
  // Extract user and project IDs from request
  const userId = req.user._id;
  const projectId = req.params.id;

  try {
    // Find project by ID
    const userRole = req.user.role;
    const findProject = await Project.findById(projectId);
    if (!findProject)
      return next(new ApiError(STATUS_CODES.NOT_FOUND, "No project found", ""));

    // Only allow the manager who created the project or an admin to delete
    const isCreatorManager =
      findProject.createdByUserId.equals(userId) &&
      ROLE_PERMISSIONS[userRole]?.canManageProjects;

    const isAdmin = userRole === ROLES.ADMIN;
    if (!isCreatorManager && !isAdmin) {
      return next(
        new ApiError(
          STATUS_CODES.FORBIDDEN,
          "You are not authorized to delete this project",
          ""
        )
      );
    }

    // === Cascade delete: Remove all attachments from tickets ===
    const allTickets = await Ticket.find({ relatedProject: projectId });

    for (const ticket of allTickets) {
      for (const attachment of ticket.attachments) {
        if (attachment.type === "file" && attachment.public_id) {
          try {
            await cloudinary.uploader.destroy(attachment.public_id);
          } catch (error) {
            next(
              new ApiError(
                STATUS_CODES.SERVER_ERROR,
                "Failed to delete attachment",
                error.message
              )
            );
            return;
          }
        }
      }
    }

    // === Cascade delete: Remove all related tickets ===
    await Ticket.deleteMany({ relatedProject: projectId });

    // Remove project reference from workspace
    await Workspace.updateMany(
      { projects: projectId },
      { $pull: { projects: projectId } }
    );

    // Delete the project document
    await Project.findByIdAndDelete(projectId);

    // Respond with success message
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Project and related data deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
