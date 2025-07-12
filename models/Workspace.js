import mongoose from "mongoose";

const refType = mongoose.Schema.Types.ObjectId;

const WorkspaceSchema = new mongoose.Schema(
  {
    workspaceName: { type: String, required: true },
    workspaceDescription: { type: String, default: null },
    createdByUserId: { type: refType, ref: "User" },
    updatedByUserId: { type: refType, ref: "User", default: null },
    workspaceMembers: [{ type: refType, ref: "User" }],
    projects: [{ type: refType, ref: "Project" }],
  },
  { timestamps: true }
);

const Workspace = mongoose.model("Workspace", WorkspaceSchema);
export default Workspace;
