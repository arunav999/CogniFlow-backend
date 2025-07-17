// ==================== Get User Controller ====================
// Returns the authenticated user's profile information

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

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
    });
  } catch (error) {
    next(error);
  }
};
