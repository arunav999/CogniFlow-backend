// ==================== Patch Project Controller ====================
// Handles updating a project's details and returns the updated project

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

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
    // Find workspace and project by ID
    const findWorkspace = await Workspace.findById(workspaceId);
    const findProject = await Project.findById(projectId);

    // If workspace not found, respond with error
    if (!findWorkspace)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No workspace found" });

    // If project not found, respond with error
    if (!findProject)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No project found" });

    // Update project details
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
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
