// User Model
import User from "../../models/User.js";

// Error
import ApiError from "../../errors/Apierror.js";

// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

export const getUser = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(STATUS_CODES.OK).json({
      user: {
        _id: user._id,
        avatar: {
          imageLink: user.avatar.url,
          imageId: user.avatar.public_id,
        },
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        workspace: user.workspace,
        company: user.company,
      },
    });
  } catch (error) {
    next(error);
  }
};
