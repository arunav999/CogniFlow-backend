import mongoose from "mongoose";

import { STATUS, TICKET_TYPE, PRIORITY } from "../constants/enums.js";

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
    attachments: [
      {
        url: { type: String, default: null },
      },
    ],
    createdByUserId: { type: refType, ref: "User" },
    updatedByUserId: { type, refType, ref: "User", default: null },
    assignedMembers: [{ type: refType, ref: "User" }],
    relatedProject: { type: refType, ref: "Project" },
    tasks: [{ type: refType, ref: "Task" }],
    comments: [{ type: refType, ref: "Comment" }],
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;
