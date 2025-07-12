import mongoose from "mongoose";

const InviteCodeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  role: { type: String, required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  invitedEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 900 }, // 15 mins
});

InviteCodeSchema.index({ code: 1, invitedEmail: 1 }, { unique: true });

const InviteCode = mongoose.model("InviteCode", InviteCodeSchema);
export default InviteCode;
