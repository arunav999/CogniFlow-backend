// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Workspace from "../../models/Workspace.js";

// Patch single waorkspace by id
export const patchWorkspaceById = async (req, res, next) => {
  const userId = req.user._id;
  const workspaceId = req.params.id;

  try {
    // Find and update
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

    // If no workspace
    if (!updatedWorkspace)
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Workspace not found",
      });

    // response
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Workspace updated successfully",
      updatedWorkspaceId: updatedWorkspace._id,
      updatedWorkspaceName: updatedWorkspace.workspaceName,
      updatedWorkspaceDescription: updatedWorkspace.workspaceDescription,
      createdBy: updatedWorkspace.createdByUserId,
      updatedBy: updatedWorkspace.updatedByUserId,
      workspaceMembers: updatedWorkspace.workspaceMembers,
      projects: updatedWorkspace.projects,
    });
  } catch (error) {
    next(error);
  }
};
