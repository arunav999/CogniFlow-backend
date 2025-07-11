// Error
import ApiError from "../../errors/Apierror.js";

// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

export const createWorkspaceValidator = (req, res, next) => {
  const { workspaceName } = req.body;

  // ========== PRESENSE CHECK ==========
  // workspace name
  if (!workspaceName)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Workspace name is required",
      "workspaceName"
    );

  // no user
  if (!req.user)
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      "Not authorized. No user",
      ""
    );

  // ========== CONTENT VALIDATION ==========
  let workspaceNameSanitized = workspaceName.trim();

  // check length
  if (workspaceNameSanitized.length < 5)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Workspacename must be atleast 5 characters",
      ""
    );

  // check if admin?
  const user = req.user;
  if (user.role !== "admin")
    throw new ApiError(
      STATUS_CODES.FORBIDDEN,
      "You are not authorized to create workspaces",
      ""
    );

  // Overwrite req.body
  req.body.workspaceName = workspaceNameSanitized;

  // Next middleware/controller
  next();
};
