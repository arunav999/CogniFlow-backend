// ==================== Get User Controller ====================
// Returns the authenticated user's profile information

// Error
import ApiError from "../../errors/Apierror.js";

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";
import { ROLES } from "../../constants/roles.js";

// Models
import User from "../../models/User.js";
import Project from "../../models/Project.js";

// Main getUser controller
export const getUser = async (req, res, next) => {
  try {
    // Get user from request (set by auth middleware)
    const user = req.user;

    // Respond with user profile details
    res.status(STATUS_CODES.OK).json({
      success: true,
      user: {
        isVerified: user.isVerified,
        _id: user._id,
        avatar: {
          url: user.avatar.url,
          public_id: user.avatar.public_id,
        },
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        workspaces: user.workspaces,
        company: user.company,
      },
      redirect:
        user.role === ROLES.ADMIN
          ? "/admin"
          : user.role === ROLES.MANAGER
          ? "/manager"
          : "/developer",
    });
  } catch (error) {
    next(error);
  }
};

// Get all user (for workspace, projects and tickets)

// Get User details by id
export const getUserById = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const findUser = await User.findById(userId);
    if (!findUser)
      return next(new ApiError(STATUS_CODES.NOT_FOUND, "User not found"));

    // Get user Projects
    const userProjects = await Project.findOne({
      assignedMembers: userId,
    });
    let noProject;
    let projectId;
    if (!userProjects) {
      noProject = "No Project assigned";
    } else {
      projectId = userProjects._id;
    }

    // Send response
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "User found",
      user: {
        isVerified: findUser.isVerified,
        id: findUser._id,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        email: findUser.email,
        avatar: {
          url: findUser.avatar.url,
          public_id: findUser.avatar.public_id,
        },
        role: findUser.role,
        workspaces: findUser.workspaces,
        company: findUser.company,
        projects: userProjects ? projectId : noProject,
      },
    });
  } catch (error) {
    next(error);
  }
};
