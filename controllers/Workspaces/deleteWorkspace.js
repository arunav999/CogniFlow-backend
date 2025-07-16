// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Roles Constants
import { ROLE_PERMISSIONS } from "../../constants/roleDefinitions.js";

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Models
import User from "../../models/User.js";
import Workspace from "../../models/Workspace.js";
import Project from "../../models/Project.js";
import Ticket from "../../models/Ticket.js";

export const deleteWorkspaceById = async (req, res, next) => {
  const workspaceId = req.params.id;

  try {
    // === Authorization: Only allow admin to delete ===
    const userRole = req.user.role;
    if (!ROLE_PERMISSIONS[userRole]?.canManageWorkspaces)
      return next(
        new ApiError(
          STATUS_CODES.FORBIDDEN,
          "You are not authorized to delete this workspace",
          ""
        )
      );

    // === Validation: Check if workspace exists ===
    const findWorkspace = await Workspace.findById(workspaceId);
    // If no workspace
    if (!findWorkspace)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No workspace found" });

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
