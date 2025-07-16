// ==================== Patch Workspace Controller ====================
// Handles updating a workspace's details and returns the updated workspace

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Workspace model
import Workspace from "../../models/Workspace.js";

// Main patchWorkspaceById controller
export const patchWorkspaceById = async (req, res, next) => {
  // Extract user and workspace IDs from request
  const userId = req.user._id;
  const workspaceId = req.params.id;

  try {
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
