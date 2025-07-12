// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Workspace from "../../models/Workspace.js";

// Get all workspaces
export const getAllWorkspaces = async (req, res, next) => {
  try {
    // Get workspace
    const userId = req.user._id;

    // Populate workspace
    const getAllWorkspacesAdmin = await Workspace.find({
      workspaceMembers: userId,
    });

    res.status(STATUS_CODES.OK).json({
      workspaces: getAllWorkspacesAdmin.map((item) => ({
        id: item._id,
        name: item.workspaceName,
        createdBy: item.createdByUserId,
        members: item.workspaceMembers,
        projects: item.projects,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Get a single workspace by id
export const getWorkspaceById = async (req, res, next) => {
  try {
    const workspaceId = req.params.id;

    const findWorkspace = await Workspace.findById(workspaceId);

    res.status(STATUS_CODES.OK).json({
      workspace: {
        id: findWorkspace._id,
        name: findWorkspace.workspaceName,
        projects: findWorkspace.projects,
        createdBy: findWorkspace.createdByUserId,
        members: findWorkspace.workspaceMembers,
      },
    });
  } catch (error) {
    next(error);
  }
};
