// ==================== Create Workspace Controller ====================
// Handles creation of a new workspace and updates the user

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Roles Constants
import { ROLE_PERMISSIONS } from "../../constants/roleDefinitions.js";

// Models for user and workspace
import User from "../../models/User.js";
import Workspace from "../../models/Workspace.js";

// Main createWorkspaceController
export const createWorkspaceController = async (req, res, next) => {
  // Extract user and workspace details from request
  const userId = req.user._id;
  const { workspaceName, workspaceDescription } = req.body;

  try {
    // Check role of the user
    const userRole = req.user.role;
    if (!ROLE_PERMISSIONS[userRole]?.canManageWorkspaces)
      return next(
        new ApiError(
          STATUS_CODES.FORBIDDEN,
          "Only admins can create workspaces",
          ""
        )
      );

    // Create new workspace document
    const newWorkspace = await Workspace.create({
      workspaceName,
      workspaceDescription,
      createdByUserId: userId,
      workspaceMembers: [userId],
    });

    // Get new workspace's ID
    const newWorkspaceId = newWorkspace._id;

    // Add workspace to user's workspaces array
    await User.updateOne(
      { _id: userId },
      { $addToSet: { workspaces: newWorkspaceId } }
    );

    // Respond with workspace details
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "Workspace created successfully",
      workspaceDetails: {
        id: newWorkspaceId,
        name: newWorkspace.workspaceName,
        description: newWorkspace.workspaceDescription,
        createdBy: newWorkspace.createdByUserId,
        updatedBy: newWorkspace.updatedByUserId,
        assignedMembers: newWorkspace.workspaceMembers,
        projects: newWorkspace.projects,
        createdAt: newWorkspace.createdAt,
        updatedAt: newWorkspace.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
