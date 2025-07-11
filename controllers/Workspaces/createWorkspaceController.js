// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Error
import ApiError from "../../errors/Apierror.js";

// Models
import Workspace from "../../models/Workspace.js";

export const createWorkspaceController = async (req, res, next) => {
  const {} = req.body;

  try {
  } catch (error) {
    next(error);
  }
};
