import mongoose from "mongoose";

import { PROJECT_STATUS } from "../constants/enums";

const ProjectSchema = new mongoose.Schema(
  {
    projectStatus: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.ACTIVE,
    },
    projectName: { type: String, required: true },
    projectDescription: { type: String },
    workspaceRef: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
    createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);
export default Project;
