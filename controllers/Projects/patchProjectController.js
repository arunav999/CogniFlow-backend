// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Workspace from "../../models/Workspace.js";
import Project from "../../models/Project.js";

export const pathProjectByIdController = async (req, res, next) => {
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
    const findWorkspace = await Workspace.findById(workspaceId);
    const findProject = await Project.findById(projectId);

    // If no worksapce
    if (!findWorkspace)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No workspace found" });

    // if no project
    if (!findProject)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No project found" });

    // Update project
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

    // response
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
