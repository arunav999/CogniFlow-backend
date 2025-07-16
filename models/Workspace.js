// ==================== Workspace Model ====================
// Defines the schema for Workspace documents in MongoDB

import mongoose from "mongoose";

const refType = mongoose.Schema.Types.ObjectId;

// Workspace schema definition
const WorkspaceSchema = new mongoose.Schema(
  {
    // Name of the workspace
    workspaceName: { type: String, required: true },
    // Description of the workspace
    workspaceDescription: { type: String, default: null },
    // User who created the workspace
    createdByUserId: { type: refType, ref: "User" },
    // User who last updated the workspace
    updatedByUserId: { type: refType, ref: "User", default: null },
    // Members of the workspace
    workspaceMembers: [{ type: refType, ref: "User" }],
    // Projects associated with the workspace
    projects: [{ type: refType, ref: "Project" }],
  },
  { timestamps: true }
);

// Workspace model
const Workspace = mongoose.model("Workspace", WorkspaceSchema);
export default Workspace;
