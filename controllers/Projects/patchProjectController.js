// ==================== Patch Project Controller ====================
// Handles updating a project's details and returns the updated project

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Roles Constants
import { ROLE_PERMISSIONS } from "../../constants/roleDefinitions.js";

// Models for workspace and project
import Workspace from "../../models/Workspace.js";
import Project from "../../models/Project.js";

// Main patchProjectById controller
export const patchProjectByIdController = async (req, res, next) => {
  // Extract user and project details from request
  const userId = req.user._id;
  const {
    workspaceId,
    projectStatus,
    projectName,
    projectDescription,
    projectIcon,
  } = req.body;
  const projectId = req.params.id;

  try {
    // Authorization check for user role
    const userRole = req.user.role;
    if (!ROLE_PERMISSIONS[userRole]?.canManageProjects)
      return next(
        new ApiError(
          STATUS_CODES.FORBIDDEN,
          "You are not authorized to update projects",
          ""
        )
      );

    // Update project details
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, workspaceRef: workspaceId },
      {
        $set: {
          projectStatus,
          projectName,
          projectDescription,
          projectIcon,
          updatedByUserId: userId,
        },
      },
      { new: true }
    );

    if (!updatedProject)
      return next(
        new ApiError(STATUS_CODES.NOT_FOUND, "Projects or workspace not found.")
      );

    // Respond with updated project info
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Project updated successfully",
      updatedProject: {
        id: updatedProject._id,
        status: updatedProject.projectStatus,
        name: updatedProject.projectName,
        description: updatedProject.projectDescription,
        icon: updatedProject.projectIcon,
        workspaceRef: updatedProject.workspaceRef,
        createdBy: updatedProject.createdByUserId,
        updatedBy: updatedProject.updatedByUserId,
        assignedMembers: updatedProject.assignedMembers,
        tickets: updatedProject.tickets,
      },
    });
  } catch (error) {
    next(error);
  }
};
