// ==================== Create Project Controller ====================
// Handles creation of a new project and updates the workspace

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models for workspace and project
import Workspace from "../../models/Workspace.js";
import Project from "../../models/Project.js";

// Main createProjectController
export const createProjectController = async (req, res, next) => {
  // Extract user and project details from request
  const userId = req.user._id;
  const { workspaceId, projectName, projectDescription, projectIcon } =
    req.body;

  try {
    // Create new project document
    const newProject = await Project.create({
      projectName,
      projectDescription,
      projectIcon,
      workspaceRef: workspaceId,
      createdByUserId: userId,
    });

    // Get new project's ID
    const newProjectId = newProject._id;

    // Find workspace by ID
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace)
      throw new ApiError(STATUS_CODES.NOT_FOUND, "Workspace not found", "");

    // Check if project already exists in workspace
    if (workspace.projects.includes(newProjectId))
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        "This project already exists in the workspace",
        ""
      );

    // Add project to workspace's projects array
    await Workspace.updateOne(
      { _id: workspaceId },
      { $addToSet: { projects: newProjectId } }
    );

    // Respond with project details
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "Project created successfully",
      projectDetails: {
        id: newProjectId,
        status: newProject.projectStatus,
        name: newProject.projectName,
        description: newProject.projectDescription,
        icon: newProject.projectIcon,
        workspaceRef: newProject.workspaceRef,
        createdByUser: newProject.createdByUserId,
        updateedByUser: newProject.updatedByUserId,
        assignedMembers: newProject.assignedMembers,
        tickets: newProject.tickets,
      },
    });
  } catch (error) {
    next(error);
  }
};
