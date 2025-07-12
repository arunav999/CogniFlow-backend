import mongoose from "mongoose";

const WorkspaceSchema = new mongoose.Schema(
  {
    workspaceName: { type: String, required: true },
    createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    workspaceMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Workspace = mongoose.model("Workspace", WorkspaceSchema);
export default Workspace;
