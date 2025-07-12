// Error
import ApiError from "../../errors/Apierror.js";

// Constant
import { STATUS_CODES } from "../../constants/statusCodes.js";
import { ROLES } from "../../constants/roles.js";

export const createProjectValidator = (req, res, next) => {
  const { projectName, projectDescription = "" } = req.body;

  // ========== PRESENSE CHECK ==========
  // project name
  if (!projectName)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Project name is required",
      ""
    );

  // no user
  if (!req.user)
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      "Not authorized. No User",
      ""
    );

  // ========== CONTENT VALIDATION ==========
  let projectNameSanitized = projectName.trim();
  let projectDescriptionSanitized = projectDescription.trim();

  // check length
  if (projectNameSanitized.length < 5)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Project name must be atleast 5 characters",
      ""
    );

  if (projectDescriptionSanitized > 0 && projectDescriptionSanitized < 15)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Project description must be atleast 15 characters",
      ""
    );

  // check if admin or manager?
  const user = req.user;
  if (user.role !== ROLES.ADMIN && user.role !== ROLES.MANAGER)
    throw new ApiError(
      STATUS_CODES.FORBIDDEN,
      "You are not authorized to create projects",
      ""
    );

  // Overwrite req.body
  req.body.projectName = projectNameSanitized;
  req.body.projectDescription = projectDescriptionSanitized;

  // Next middleware/controller
  next();
};
