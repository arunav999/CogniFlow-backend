// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Workspace from "../../models/Workspace.js";
import Project from "../../models/Project.js";

export const deleteProjectByIdController = async (req, res, next) => {
  const userId = req.user._id;
  const projectId = req.params.id;

  try {
    // === Validation: Check if project exists ===
    const findProject = await Project.findById(projectId);
    // If no project
    if (!findProject)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No project found." });

    // === Authorization: Only allow creator to delete ===
    if (!findProject.createdByUserId.equals(userId))
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "You are not authorized to delete this project",
      });

    // === Cascade delete: Remove all related tickets ===

    // === Remove project reference from workspace ===
    await Workspace.updateMany(
      { projects: projectId },
      { $pull: { projects: projectId } }
    );

    // === Delete project ===
    await Project.findByIdAndDelete(projectId);

    // === Response ===
    res
      .status(STATUS_CODES.OK)
      .json({
        success: true,
        message: "Project and related data deleted successfully",
      });
  } catch (error) {
    next(error);
  }
};
