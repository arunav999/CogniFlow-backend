import mongoose from "mongoose";

import { PROJECT_STATUS } from "../constants/enums.js";

const refType = mongoose.Schema.Types.ObjectId;

const ProjectSchema = new mongoose.Schema(
  {
    projectStatus: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.ACTIVE,
    },
    projectName: { type: String, required: true },
    projectDescription: { type: String, default: null },
    projectIcon: { type: String, default: null },
    workspaceRef: { type: refType, ref: "Workspace", required: true },
    createdByUserId: { type: refType, ref: "User", required: true },
    updatedByUserId: {
      type: refType,
      ref: "User",
      default: null,
      required: true,
    },
    assignedMembers: [{ type: refType, ref: "User" }],
    tickets: [{ type: refType, ref: "Ticket" }],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);
export default Project;
