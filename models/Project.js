// ==================== Project Model ====================
// Defines the schema for Project documents in MongoDB

import mongoose from "mongoose";

import { PROJECT_STATUS } from "../constants/enums.js";

const refType = mongoose.Schema.Types.ObjectId;

// Project schema definition
const ProjectSchema = new mongoose.Schema(
  {
    // Status of the project (active, archived, etc.)
    projectStatus: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.ACTIVE,
    },
    // Name of the project
    projectName: { type: String, required: true },
    // Description of the project
    projectDescription: { type: String, default: null },
    // Optional icon for the project
    projectIcon: { type: String, default: null },
    // Reference to the workspace this project belongs to
    workspaceRef: { type: refType, ref: "Workspace" },
    // User who created the project
    createdByUserId: { type: refType, ref: "User" },
    // User who last updated the project
    updatedByUserId: {
      type: refType,
      ref: "User",
      default: null,
    },
    // Members assigned to the project
    assignedMembers: [{ type: refType, ref: "User" }],
    // Tickets associated with the project
    tickets: [{ type: refType, ref: "Ticket" }],
  },
  { timestamps: true }
);

// Project model
const Project = mongoose.model("Project", ProjectSchema);
export default Project;
