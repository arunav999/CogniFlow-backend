import mongoose from "mongoose";

import {
  STATUS,
  TICKET_TYPE,
  PRIORITY,
  FILE_TYPE,
} from "../constants/enums.js";

const refType = mongoose.Schema.Types.ObjectId;

const TicketSchema = new mongoose.Schema(
  {
    ticketStatus: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.TODO,
    },
    ticketType: {
      type: String,
      enum: Object.values(TICKET_TYPE),
      default: TICKET_TYPE.FEATURE,
    },
    ticketPriority: {
      type: String,
      enum: Object.values(PRIORITY),
      default: PRIORITY.LOW,
    },
    ticketTitle: { type: String, required: true },
    ticketDescription: { type: String, required: true },
    ticketDeadline: { type: Date, required: true },
    createdByUserId: { type: refType, ref: "User" },
    updatedByUserId: { type: refType, ref: "User", default: null },
    assignedMembers: [{ type: refType, ref: "User" }],
    relatedProject: { type: refType, ref: "Project" },
    tasks: [
      {
        title: { type: String },
        completed: { type: Boolean, default: false },
      },
    ],
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
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: refType, ref: "User" },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;
