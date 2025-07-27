// ==================== Get Project Controllers ====================
// Handles fetching all projects for a workspace and fetching a project by ID

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Project model
import Project from "../../models/Project.js";

// Get all projects in a workspace
export const getAllProjectsController = async (req, res, next) => {
  try {
    // Extract workspace ID from request params
    const workspaceId = req.params.wid;

    // Find all projects belonging to the workspace
    const getAllProjects = await Project.find({ workspaceRef: workspaceId });

    // If no projects found, respond with error
    if (getAllProjects.length === 0)
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No projects created for this workspace.",
      });

    // Respond with list of projects
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
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Get a project by its ID
export const getProjectByIdController = async (req, res, next) => {
  try {
    // Extract project ID from request params
    const projectId = req.params.id;

    // Find project by ID
    const findProject = await Project.findById(projectId);

    // If project not found, respond with error
    if (!findProject)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No project found" });

    // Respond with project details
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
        createdAt: findProject.createdAt,
        updatedAt: findProject.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
