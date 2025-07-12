// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Workspace from "../../models/Workspace.js";

// Patch single waorkspace by id
export const patchWorkspaceById = async (req, res, next) => {
  try {
    const workspaceId = req.params.id;
  } catch (error) {
    next(error);
  }
};
