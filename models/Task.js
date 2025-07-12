import mongoose from "mongoose";

import { STATUS } from "../constants/enums.js";

const refType = mongoose.Schema.Types.ObjectId;

const TaskSchema = new mongoose.Schema(
  {
    taskStatus: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.TODO,
    },
    taskName: [{ type: String }],
    assignedTicket: { type: refType, ref: "Ticket" },
    createdByUserId: { type: refType, ref: "User" },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);
export default Task;
