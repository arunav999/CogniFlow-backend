// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import User from "../../models/User.js";
import Workspace from "../../models/Workspace.js";

export const createWorkspaceController = async (req, res, next) => {
  const userId = req.user._id;

  const { workspaceName, workspaceDescription } = req.body;

  try {
    // Creating workspace
    const newWorkspace = await Workspace.create({
      workspaceName,
      workspaceDescription,
      createdByUserId: userId,
      workspaceMembers: [userId],
    });

    const newWorkspaceId = newWorkspace._id;

    // Update User
    await User.updateOne(
      { _id: userId },
      { $addToSet: { workspaces: newWorkspaceId } }
    );

    // Send response
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
      },
    });
  } catch (error) {
    next(error);
  }
};
