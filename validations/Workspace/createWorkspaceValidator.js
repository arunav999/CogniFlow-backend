// ==================== Create Workspace Validator ====================
// Validates workspace creation request body for required fields and correct format

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Status code constants and roles
import { STATUS_CODES } from "../../constants/statusCodes.js";
import { ROLES } from "../../constants/roles.js";

// Middleware to validate create workspace input
export const createWorkspaceValidator = (req, res, next) => {
  // Extract workspace name and description from request body
  const { workspaceName, workspaceDescription = "" } = req.body;

  // Presence check: workspace name
  if (!workspaceName)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Workspace name is required",
      "workspaceName"
    );

  // Presence check: user
  if (!req.user)
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      "Not authorized. No user",
      ""
    );

  // Content validation: sanitize and check length/format
  let workspaceNameSanitized = workspaceName.trim();
  let workspaceDescriptionSanitized = workspaceDescription.trim();

  // Workspace name length check
  if (workspaceNameSanitized.length < 5)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Workspace name must be atleast 5 characters",
      ""
    );

  // Workspace description length check (if provided)
  if (
    workspaceDescriptionSanitized.length > 0 &&
    workspaceDescriptionSanitized.length < 15
  )
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Workspace description must be atleast 15 characters",
      ""
    );

  // Role check: only admin can create workspaces
  const user = req.user;
  if (user.role !== ROLES.ADMIN)
    throw new ApiError(
      STATUS_CODES.FORBIDDEN,
      "You are not authorized to create workspaces",
      ""
    );

  // Overwrite req.body with sanitized values
  req.body.workspaceName = workspaceNameSanitized;
  req.body.workspaceDescription = workspaceDescriptionSanitized;

  // Next middleware/controller
  next();
};
