// ==================== Create Project Validator ====================
// Validates project creation request body for required fields and correct format

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Status code constants and roles
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Roles Constants
import { ROLE_PERMISSIONS } from "../../constants/roleDefinitions.js";

// Middleware to validate create project input
export const createProjectValidator = (req, res, next) => {
  // Extract project name and description from request body
  const { projectName, projectDescription = "" } = req.body;

  // Presence check: project name
  if (!projectName)
    return next(
      new ApiError(STATUS_CODES.BAD_REQUEST, "Project name is required", "")
    );

  // Presence check: user
  if (!req.user)
    return next(
      new ApiError(STATUS_CODES.UNAUTHORIZED, "Not authorized. No User", "")
    );

  // Content validation: sanitize and check length/format
  let projectNameSanitized = projectName.trim();
  let projectDescriptionSanitized = projectDescription.trim();

  // Project name length check
  if (projectNameSanitized.length < 5)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Project name must be atleast 5 characters",
        ""
      )
    );

  // Project description length check (if provided)
  if (
    projectDescriptionSanitized.length > 0 &&
    projectDescriptionSanitized.length < 15
  )
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Project description must be atleast 15 characters",
        ""
      )
    );

  // Role check: only admin or manager can create projects
  const userRole = req.user.role;
  if (!ROLE_PERMISSIONS[userRole]?.canManageProjects)
    return next(
      new ApiError(
        STATUS_CODES.FORBIDDEN,
        "You are not authorized to create projects",
        ""
      )
    );

  // Overwrite req.body with sanitized values
  req.body.projectName = projectNameSanitized;
  req.body.projectDescription = projectDescriptionSanitized;

  // Proceed to next middleware/controller
  next();
};
