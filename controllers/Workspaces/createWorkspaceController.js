// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import User from "../../models/User.js";
import Workspace from "../../models/Workspace.js";

export const createWorkspaceController = async (req, res, next) => {
  const userId = req.user._id;

  const { workspaceName } = req.body;

  try {
    // Creating workspace
    const newWorkspace = await Workspace.create({
      workspaceName,
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
      workspaceId: newWorkspaceId,
      workspaceName: newWorkspace.workspaceName,
      workspaceDescription: newWorkspace.workspaceDescription,
      createdBy: newWorkspace.createdByUserId,
      workspaceMembers: newWorkspace.workspaceMembers,
      projects: newWorkspace.projects,
    });
  } catch (error) {
    next(error);
  }
};
