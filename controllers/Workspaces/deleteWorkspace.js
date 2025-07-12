// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Models
import Workspace from "../../models/Workspace.js";

export const deleteWorkspaceById = async (req, res, next) => {
  const workspaceId = req.params.id;

  try {
    // if no workspace
    const findWorkspace = await Workspace.findById(workspaceId);
    // If now workspace
    if (!findWorkspace)
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: "No workspace found" });

    // Find and delete
    await Workspace.findByIdAndDelete(workspaceId);

    // response
    res
      .status(STATUS_CODES.OK)
      .json({ success: true, message: "Workspace deleted successfully" });
  } catch (error) {
    next(error);
  }
};
