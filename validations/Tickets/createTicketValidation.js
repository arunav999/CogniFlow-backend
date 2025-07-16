// ==================== Create Ticket Validator ====================
// Validates ticket creation request body for required fields and correct format

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Status code constants and roles
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Roles Constants
import { ROLE_PERMISSIONS } from "../../constants/roleDefinitions.js";

// Middleware to validate create ticket input
export const createTicketValidator = (req, res, next) => {
  // Extract ticket title, description, and deadline from request body
  const { ticketTitle, ticketDescription, ticketDeadline } = req.body;

  // Presence check: ticket title
  if (!ticketTitle)
    return next(
      new ApiError(STATUS_CODES.BAD_REQUEST, "Ticket name is required", "")
    );

  // Presence check: ticket description
  if (!ticketDescription)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Ticket description is required",
        ""
      )
    );

  // Presence check: ticket deadline
  if (!ticketDeadline)
    return next(
      new ApiError(STATUS_CODES.BAD_REQUEST, "Ticket deadline is required", "")
    );

  // Content validation: sanitize and check length/format
  const deadlineDate = new Date(ticketDeadline);
  const now = new Date();
  let ticketTitleSanitized = ticketTitle.trim();
  let ticketDescriptionSanitized = ticketDescription.trim();

  // Ticket title length check
  if (ticketTitleSanitized.length < 5)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Ticket name must be atleast 5 characters",
        ""
      )
    );

  // Ticket description length check
  if (ticketDescriptionSanitized.length < 15)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Ticket description must be atleast 15 characters",
        ""
      )
    );

  // Deadline date format check
  if (isNaN(deadlineDate))
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Invalid date format for ticket deadline",
        ""
      )
    );

  // Deadline must be in the future
  if (deadlineDate <= now)
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Ticket deadline must be a future date",
        ""
      )
    );

  // For tasks
  if (!Array.isArray(req.body.tasks))
    return next(
      new ApiError(STATUS_CODES.BAD_REQUEST, "Tasks must be an array", "")
    );

  const validateTasks = (req.body.tasks || []).map((task) => {
    const taskSanitized = task.title.trim();

    if (
      typeof task.title !== "string" ||
      (taskSanitized.length > 0 && taskSanitized.length < 5)
    )
      return next(
        new ApiError(
          STATUS_CODES.BAD_REQUEST,
          "Each task title must be a string with at least 5 characters",
          ""
        )
      );

    return {
      title: taskSanitized,
      completed: !!task.completed,
    };
  });

  // Check role
  const userRole = req.user.role;
  if (!ROLE_PERMISSIONS[userRole]?.canManageTickets)
    return next(
      new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        "You are not authorized to create tickets",
        ""
      )
    );

  //Overwrite req.body
  req.body.ticketTitle = ticketTitleSanitized;
  req.body.ticketDescription = ticketDescriptionSanitized;
  req.body.tasks = validateTasks;

  // Next middleware
  next();
};
