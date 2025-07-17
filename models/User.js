// ==================== User Model ====================
// Defines the schema for User documents in MongoDB

import mongoose from "mongoose";

import { ROLES } from "../constants/roles.js";

// User schema definition
const UserSchema = new mongoose.Schema(
  {
    // Verified status of the user
    isVerified: { type: Boolean, default: false },
    // First name of the user
    firstName: { type: String, required: true },
    // Last name of the user
    lastName: { type: String },
    // Email address (unique)
    email: { type: String, required: true, unique: true },
    // Hashed password
    password: { type: String, required: true },
    // Avatar image info
    avatar: {
      url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
    // Role for access control
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.DEVELOPER,
    }, // Role based access
    // Workspaces the user is a member of
    workspaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
      },
    ],
    // Company name
    company: { type: String, required: true },
  },
  { timestamps: true }
);

// User model
const User = mongoose.model("User", UserSchema);
export default User;
