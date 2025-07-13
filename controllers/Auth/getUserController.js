// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

export const getUser = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(STATUS_CODES.OK).json({
      user: {
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
