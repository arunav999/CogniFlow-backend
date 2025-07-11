import mongoose from "mongoose";

import { ROLES } from "../constants/roles.js";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.DEVELOPER,
    }, //Role based access
    workspaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
      },
    ],
    company: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
