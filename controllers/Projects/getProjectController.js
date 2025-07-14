// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Project from "../../models/Project.js";

// Get all projects
export const getAllProjectsController = async (req, res, next) => {
  try {
    // Get workspace
    const { workspaceId } = req.body;

    // === Find All: Projects that belongs to that workspace
    const getAllProjects = await Project.find({ workspaceRef: workspaceId });

    // if no project
    if (getAllProjects.length === 0)
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No projects created for this workspace.",
      });

    // response
    res.status(STATUS_CODES.OK).json({
      success: true,
      projects: getAllProjects.map((project) => ({
        id: project._id,
        status: project.projectStatus,
        name: project.projectName,
        description: project.projectDescription,
        icon: project.projectIcon,
        workspaceRef: project.workspaceRef,
        createdBy: project.createdByUserId,
        updatedBy: project.updatedByUserId,
        assignedMembers: project.assignedMembers,
        tickets: project.tickets,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Get project by id
export const getProjectByIdController = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    // Find project
    const findProject = await Project.findById(projectId);

    // If no project
    if (!findProject)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No project found" });

    // response
    res.status(STATUS_CODES.OK).json({
      success: true,
      project: {
        id: projectId,
        status: findProject.projectStatus,
        name: findProject.projectName,
        description: findProject.projectDescription,
        icon: findProject.projectIcon,
        workspaceRef: findProject.workspaceRef,
        createdBy: findProject.createdByUserId,
        updatedBy: findProject.updatedByUserId,
        assignedMembers: findProject.assignedMembers,
        tickets: findProject.tickets,
      },
    });
  } catch (error) {
    next(error);
  }
};
