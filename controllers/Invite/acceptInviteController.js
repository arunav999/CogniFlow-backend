import jwt from "jsonwebtoken";
import cryptoHash from "../../utils/cryptoHash.js";

import InviteCode from "../../models/Token Models/InviteCode.js";

import ApiError from "../../errors/Apierror.js";
import { STATUS_CODES } from "../../constants/statusCodes.js";
import Workspace from "../../models/Workspace.js";

export const generateInviteCodeController = async (req, res, next) => {
  const userId = req.user.id;
  const { inviteToken } = req.body;

  try {
    // 1. Verify token
    const { code } = jwt.verify(inviteToken, process.env.INVITE_TOKEN_SECRET);

    // 2. hash raw code
    const hashedCode = cryptoHash(code);

    // 3. Find Invite using hashed code
    const inviteCode = await InviteCode.findOne({ code: hashedCode });

    // 4. if no invite found, it's invalid or expired
    if (!inviteCode) {
      return next(
        new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid or expired invite code")
      );
    }

    // 5. Add user to workspace
    const workspace = await Workspace.findById(inviteCode.workspace);
    if (!workspace)
      return next(new ApiError(STATUS_CODES.NOT_FOUND, "Workspace not found"));

    // Check if already a member
    if (workspace.workspaceMembers.includes(userId))
      return next(
        new ApiError(
          STATUS_CODES.CONFLICT,
          "You are already a member of this workspace"
        )
      );

    // Add user to workspace
    workspace.workspaceMembers.push(userId);
    await workspace.save();

    // 6. Delete the invite to prevent resue
    await InviteCode.deleteOne({ _id: inviteCode._id });

    // 7. Return success response
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Invite accepted successfully",
      workspaceId: workspace._id,
    });
  } catch (error) {
    return next(
      new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        "Failed to accept invite"
      )
    );
  }
};
