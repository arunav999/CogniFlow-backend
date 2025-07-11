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

    if (getAllWorkspacesAdmin.length === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ succes: false, message: "No workspace created yet." });
    }

    res.status(STATUS_CODES.OK).json({
      workspaces: getAllWorkspacesAdmin.map((item) => ({
        id: item._id,
        name: item.workspaceName,
        description: item.workspaceDescription,
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

    if (!findWorkspace)
      return res.status(STATUS_CODES.NOT_FOUND).json({
        succes: false,
        message: "Workspace not found",
      });

    res.status(STATUS_CODES.OK).json({
      workspace: {
        id: findWorkspace._id,
        name: findWorkspace.workspaceName,
        description: findWorkspace.workspaceDescription,
        projects: findWorkspace.projects,
        createdBy: findWorkspace.createdByUserId,
        members: findWorkspace.workspaceMembers,
      },
    });
  } catch (error) {
    next(error);
  }
};
