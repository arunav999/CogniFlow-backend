// ==================== Invite Code Model ====================
// Defines the schema for InviteCode documents in MongoDB

import mongoose from "mongoose";

// InviteCode schema definition
const InviteCodeSchema = new mongoose.Schema({
  // The invite code string
  code: { type: String, required: true },
  // Role assigned to the invited user
  role: { type: String, required: true },
  // Reference to the workspace for the invite
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
  // User who sent the invite
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // Email address of the invited user
  invitedEmail: { type: String, required: true },
  // Creation timestamp (expires in 15 minutes)
  createdAt: { type: Date, default: Date.now, expires: 900 }, // 15 mins
});

// Unique index for code and invitedEmail combination
InviteCodeSchema.index({ code: 1, invitedEmail: 1 }, { unique: true });

// InviteCode model
const InviteCode = mongoose.model("InviteCode", InviteCodeSchema);
export default InviteCode;
