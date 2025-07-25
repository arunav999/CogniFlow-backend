// ==================== Create Project Controller ====================
// Handles creation of a new project and updates the workspace

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Roles Constants
import { ROLE_PERMISSIONS } from "../../constants/roleDefinitions.js";

// Models for workspace and project
import Workspace from "../../models/Workspace.js";
import Project from "../../models/Project.js";

// Main createProjectController
export const createProjectController = async (req, res, next) => {
  // Extract user and project details from request
  const userId = req.user._id;
  const workspaceId = req.params.wid;
  const { projectName, projectDescription, projectIcon } = req.body;

  try {
    // Check role of the user
    const userRole = req.user.role;
    if (!ROLE_PERMISSIONS[userRole]?.canManageProjects)
      return next(
        new ApiError(
          STATUS_CODES.FORBIDDEN,
          "Only managers or admins can create projects",
          ""
        )
      );

    // Find workspace by ID
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace)
      return next(
        new ApiError(STATUS_CODES.NOT_FOUND, "Workspace not found", "")
      );

    // Check if a project with the same name exists in this workspace
    const existingProject = await Project.findOne({
      projectName,
      workspaceRef: workspaceId,
    });
    if (existingProject)
      return next(
        new ApiError(
          STATUS_CODES.CONFLICT,
          "This project already exists in the workspace",
          ""
        )
      );

    // Create new project document
    const newProject = await Project.create({
      projectName,
      projectDescription,
      projectIcon,
      workspaceRef: workspaceId,
      createdByUserId: userId,
      assignedMembers: [userId], // this will change later
    });

    // Get new project's ID
    const newProjectId = newProject._id;

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
        updatedByUser: newProject.updatedByUserId,
        assignedMembers: newProject.assignedMembers,
        tickets: newProject.tickets,
      },
    });
  } catch (error) {
    next(error);
  }
};
