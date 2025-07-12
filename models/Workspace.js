import mongoose from "mongoose";

const WorkspaceSchema = new mongoose.Schema(
  {
    workspaceName: { type: String, required: true },
    workspaceDescription: { type: String, default: null },
    createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    workspaceMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  },
  { timestamps: true }
);

const Workspace = mongoose.model("Workspace", WorkspaceSchema);
export default Workspace;
