const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema(
  {
    workspaceName: { type: String, required: true },
    createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    workspaceMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    workspaceInviteCode: String,
    workspaceInviteCodeExpires: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workspace", WorkspaceSchema);
