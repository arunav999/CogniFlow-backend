// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Workspace from "../../models/Workspace.js";

export const getAllWorkspaces = async (req, res, next) => {
  try {
    // Get workspace
    const userId = req.user._id;

    // Populate workspace
    const getAllWorkspacesAdmin = await Workspace.find({
      workspaceMembers: userId,
    });

    res.status(STATUS_CODES.OK).json({
      workspace: getAllWorkspacesAdmin,
    });
  } catch (error) {
    next(error);
  }
};
