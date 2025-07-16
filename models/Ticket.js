// ==================== Ticket Model ====================
// Defines the schema for Ticket documents in MongoDB

import mongoose from "mongoose";

import {
  STATUS,
  TICKET_TYPE,
  PRIORITY,
  FILE_TYPE,
} from "../constants/enums.js";

const refType = mongoose.Schema.Types.ObjectId;

// Ticket schema definition
const TicketSchema = new mongoose.Schema(
  {
    // Status of the ticket (todo, in progress, done, etc.)
    ticketStatus: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.TODO,
    },
    // Type of the ticket (feature, bug, etc.)
    ticketType: {
      type: String,
      enum: Object.values(TICKET_TYPE),
      default: TICKET_TYPE.FEATURE,
    },
    // Priority of the ticket (low, medium, high)
    ticketPriority: {
      type: String,
      enum: Object.values(PRIORITY),
      default: PRIORITY.LOW,
    },
    // Title of the ticket
    ticketTitle: { type: String, required: true },
    // Description of the ticket
    ticketDescription: { type: String, required: true },
    // Deadline for the ticket
    ticketDeadline: { type: Date, required: true },
    // User who created the ticket
    createdByUserId: { type: refType, ref: "User" },
    // User who last updated the ticket
    updatedByUserId: { type: refType, ref: "User", default: null },
    // Members assigned to the ticket
    assignedMembers: [{ type: refType, ref: "User" }],
    // Reference to the related project
    relatedProject: { type: refType, ref: "Project" },
    // Reference to the workspace
    workspaceRef: { type: refType, ref: "Workspace" },
    // List of tasks associated with the ticket
    tasks: [
      {
        title: { type: String },
        completed: { type: Boolean, default: false },
      },
    ],
    // Attachments for the ticket (files/images)
    attachments: [
      {
        url: { type: String, default: null },
        type: {
          type: String,
          enum: Object.values(FILE_TYPE),
          default: FILE_TYPE.NULL,
        },
      },
    ],
  },
  { timestamps: true }
);

// Ticket model
const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;
