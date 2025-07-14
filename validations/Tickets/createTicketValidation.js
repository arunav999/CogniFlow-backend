// Error
import ApiError from "../../errors/Apierror.js";

// Constant
import { STATUS_CODES } from "../../constants/statusCodes.js";
import { ROLES } from "../../constants/roles.js";

export const createTicketValidator = (req, res, next) => {
  const { ticketTitle, ticketDescription, ticketDeadline } = req.body;

  // ========== PRESENSE CHECK ==========
  // ticket name
  if (!ticketTitle)
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Ticket name is required", "");

  // ticket description
  if (!ticketDescription)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Ticket description is required",
      ""
    );

  if (!ticketDeadline)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Ticket deadline is required",
      ""
    );

  // ========== CONTENT VALIDATION ==========
  const deadlineDate = new Date(ticketDeadline);
  const now = new Date();
  let ticketTitleSanitized = ticketTitle.trim();
  let ticketDescriptionSanitized = ticketDescription.trim();

  // check length
  if (ticketTitleSanitized.length < 5)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Ticket name must be atleast 5 characters",
      ""
    );

  if (ticketDescriptionSanitized.length < 15)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Ticket description must be atleast 15 characters",
      ""
    );

  if (isNaN(deadlineDate))
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Invalid date format for ticket deadline",
      ""
    );

  if (deadlineDate <= now)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Ticket deadline must be a future date",
      ""
    );

  // For tasks
  if (!Array.isArray(req.body.tasks))
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Tasks must be an array", "");

  const validateTasks = (req.body.tasks || []).map((task) => {
    const taskSanitized = task.title.trim();

    if (
      typeof task.title !== "string" ||
      (taskSanitized.length > 0 && taskSanitized.length < 5)
    )
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Each task title must be a string with at least 5 characters",
        ""
      );

    return {
      title: taskSanitized,
      completed: !!task.completed,
    };
  });

  // Check role
  const user = req.user;
  if (
    user.role !== ROLES.ADMIN &&
    user.role !== ROLES.MANAGER &&
    user.role !== ROLES.DEVELOPER
  )
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      "You are not authorized to create tickets",
      ""
    );

  //Overwrite req.body
  req.body.ticketTitle = ticketTitleSanitized;
  req.body.ticketDescription = ticketDescriptionSanitized;
  req.body.tasks = validateTasks;

  // Next middleware
  next();
};
