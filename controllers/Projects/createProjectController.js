// Error
import ApiError from "../../errors/Apierror.js";

// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Workspace from "../../models/Workspace.js";
import Project from "../../models/Project.js";

export const createProjectController = async (req, res, next) => {
  const userId = req.user._id;

  const { workspaceId, projectName, projectDescription, projectIcon } =
    req.body;

  try {
    // find workspace
    const workspace = await Workspace.findById(workspaceId);
    // if no workspace
    if (!workspace)
      throw new ApiError(STATUS_CODES.NOT_FOUND, "Workspace not found", "");

    // Creating project
    const newProject = await Project.create({
      projectName,
      projectDescription,
      projectIcon,
      workspaceRef: workspaceId,
      createdByUserId: userId,
    });

    // Update Workspace
    const newProjectId = newProject._id;

    // check if project already a part of the workspace
    if (workspace.projects.includes(newProjectId))
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        "This project already exists in the workspace",
        ""
      );

    // if not a part
    await Workspace.updateOne(
      { _id: workspaceId },
      { $addToSet: { projects: newProjectId } }
    );

    // Send response
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
