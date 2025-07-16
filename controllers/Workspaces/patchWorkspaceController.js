// ==================== Patch Workspace Controller ====================
// Handles updating a workspace's details and returns the updated workspace

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Roles Constants
import { ROLE_PERMISSIONS } from "../../constants/roleDefinitions.js";

// Workspace model
import Workspace from "../../models/Workspace.js";

// Main patchWorkspaceById controller
export const patchWorkspaceById = async (req, res, next) => {
  // Extract user and workspace IDs from request
  const userId = req.user._id;
  const workspaceId = req.params.id;

  try {
    // Check role of the user
    const userRole = req.user.role;
    if (!ROLE_PERMISSIONS[userRole]?.canManageWorkspaces)
      return next(
        new ApiError(
          STATUS_CODES.FORBIDDEN,
          "Only admins can update workspaces",
          ""
        )
      );

    // Find workspace by ID
    const findWorkspace = await Workspace.findById(workspaceId);
    if (!findWorkspace)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No workspace found" });

    // Update workspace details
    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      workspaceId,
      {
        $set: {
          ...req.body,
          updatedByUserId: userId,
        },
      },
      { new: true }
    );

    // Respond with updated workspace info
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Workspace updated successfully",
      updatedWorkspace: {
        id: updatedWorkspace._id,
        name: updatedWorkspace.workspaceName,
        description: updatedWorkspace.workspaceDescription,
        createdBy: updatedWorkspace.createdByUserId,
        updatedBy: updatedWorkspace.updatedByUserId,
        workspaceMembers: updatedWorkspace.workspaceMembers,
        projects: updatedWorkspace.projects,
      },
    });
  } catch (error) {
    next(error);
  }
};
