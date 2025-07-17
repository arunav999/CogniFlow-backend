// Apierror.js
import ApiError from "../../errors/Apierror.js";

// Status codes
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Workspace from "../../models/Workspace.js";
import InviteCode from "../../models/Token Models/InviteCode.js";

// Send invite email utility
import sendInviteEmail from "../../utils/sendInviteEmail.js";

// Generate and hash token for invite code
import { generateInviteToken } from "../../utils/generateToken.js";
import { cryptoHash } from "../../utils/generateHash.js";

// ==================== Generate Invite Code Controller ====================
export const generateInviteCodeController = async (req, res, next) => {
  const userId = req.user.id;
  const CLIENT_URL = process.env.CLIENT_URL;

  const { role, workspaceId, inviteEmail } = req.body;

  // Generate random 6-digit invite code
  const rawCode = Math.random().toString(36).substring(2, 10);
  const hashedCode = cryptoHash(rawCode);

  const token = generateInviteToken(rawCode);
  const inviteLink = `${CLIENT_URL}/invite/${token}`;

  const workspaceName = await Workspace.findById(workspaceId).select(
    "workspaceName"
  );
  if (!workspaceName) {
    return next(new ApiError(STATUS_CODES.NOT_FOUND, "Workspace not found"));
  }

  // Save hashedCode, workspaceId and email in db
  await InviteCode.create({
    code: hashedCode,
    role,
    workspace: workspaceId,
    invitedBy: userId,
    invitedEmail: inviteEmail,
  });

  // Send invite email
  try {
    await sendInviteEmail({
      email: inviteEmail,
      inviteLink,
      workspaceName: workspaceName,
    });
  } catch (error) {
    return next(
      new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        "Failed to send invite email"
      )
    );
  }

  // Respond with success
  res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: "Invite code generated and email sent successfully",
    inviteLink,
    inviteCode: rawCode,
  });
  return;
};
