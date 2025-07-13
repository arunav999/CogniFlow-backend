// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Workspace from "../../models/Workspace.js";

// Patch single waorkspace by id
export const patchWorkspaceById = async (req, res, next) => {
  const userId = req.user._id;
  const workspaceId = req.params.id;

  try {
    // If no workspace
    const findWorkspace = await Workspace.findById(workspaceId);
    if (!findWorkspace)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No workspace found" });

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

    // response
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
