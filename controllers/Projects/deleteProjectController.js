// ==================== Delete Project Controller ====================
// Handles deletion of a project and updates the workspace

// Status code constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models for workspace and project
import Workspace from "../../models/Workspace.js";
import Project from "../../models/Project.js";

// Main deleteProjectById controller
export const deleteProjectByIdController = async (req, res, next) => {
  // Extract user and project IDs from request
  const userId = req.user._id;
  const projectId = req.params.id;

  try {
    // Find project by ID
    const findProject = await Project.findById(projectId);
    if (!findProject)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No project found." });

    // Only allow creator to delete the project
    if (!findProject.createdByUserId.equals(userId))
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "You are not authorized to delete this project",
      });

    // Remove project reference from workspace
    await Workspace.updateMany(
      { projects: projectId },
      { $pull: { projects: projectId } }
    );

    // Delete the project document
    await Project.findByIdAndDelete(projectId);

    // Respond with success message
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Project and related data deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
