// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Workspace from "../../models/Workspace.js";

export const createWorkspaceController = async (req, res, next) => {
  const { workspaceName } = req.body;

  try {
    // Creating workspace
    const newWorkspace = await Workspace.create({
      workspaceName,
      createdByUserId: req.user._id,
      workspaceMembers: [req.user._id],
    });

    // Send response
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "Workspace created successfully",
      workspaceId: newWorkspace._id,
      details: newWorkspace,
    });
  } catch (error) {
    next(error);
  }
};
