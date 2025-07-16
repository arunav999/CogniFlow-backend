// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import User from "../../models/User.js";
import Workspace from "../../models/Workspace.js";
import Project from "../../models/Project.js";
import Ticket from "../../models/Ticket.js";

export const deleteWorkspaceById = async (req, res, next) => {
  const userId = req.user._id;
  const workspaceId = req.params.id;

  try {
    // === Validation: Check if workspace exists ===
    const findWorkspace = await Workspace.findById(workspaceId);
    // If no workspace
    if (!findWorkspace)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No workspace found" });

    // === Authorization: Only allow creator to delete ===
    if (!findWorkspace.createdByUserId.equals(userId))
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "You are not authorized to delete this workspace",
      });

    // === Cascade delete: Remove all related tickets ===
    await Ticket.deleteMany({ workspaceRef: workspaceId });

    // === Cascade delete: Remove all related projects ===
    await Project.deleteMany({ workspaceRef: workspaceId });

    // === Remove workspace reference from users ===
    await User.updateMany(
      { workspaces: workspaceId },
      { $pull: { workspaces: workspaceId } }
    );

    // === Delete workspace ===
    await Workspace.findByIdAndDelete(workspaceId);

    // === Response ===
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Workspace and related data deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
