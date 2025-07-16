// ==================== Get Workspace Controllers ====================
// Handles fetching all workspaces for a user and fetching a workspace by ID

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Workspace model
import Workspace from "../../models/Workspace.js";

// Get all workspaces for the authenticated user
export const getAllWorkspaces = async (req, res, next) => {
  try {
    // Extract user ID from request
    const userId = req.user._id;

    // Find all workspaces where user is a member
    const getAllWorkspacesAdmin = await Workspace.find({
      workspaceMembers: userId,
    });

    // If no workspaces found, respond with error
    if (getAllWorkspacesAdmin.length === 0) {
      return next(
        new ApiError(STATUS_CODES.NOT_FOUND, "No workspace created yet.", "")
      );
    }

    // Respond with list of workspaces
    res.status(STATUS_CODES.OK).json({
      success: true,
      workspaces: getAllWorkspacesAdmin.map((workspace) => ({
        id: workspace._id,
        name: workspace.workspaceName,
        description: workspace.workspaceDescription,
        createdBy: workspace.createdByUserId,
        updatedBy: workspace.updatedByUserId,
        members: workspace.workspaceMembers,
        projects: workspace.projects,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Get a workspace by its ID
export const getWorkspaceById = async (req, res, next) => {
  try {
    // Extract workspace ID from request params
    const workspaceId = req.params.id;

    // Find workspace by ID
    const findWorkspace = await Workspace.findById(workspaceId);

    // If workspace not found, respond with error
    if (!findWorkspace)
      return next(
        new ApiError(STATUS_CODES.NOT_FOUND, "Workspace not found", "")
      );

    // Respond with workspace details
    res.status(STATUS_CODES.OK).json({
      workspace: {
        id: findWorkspace._id,
        name: findWorkspace.workspaceName,
        description: findWorkspace.workspaceDescription,
        projects: findWorkspace.projects,
        createdBy: findWorkspace.createdByUserId,
        updatedBy: findWorkspace.updatedByUserId,
        members: findWorkspace.workspaceMembers,
      },
    });
  } catch (error) {
    next(error);
  }
};
