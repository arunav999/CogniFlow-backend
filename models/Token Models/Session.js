// ==================== Session Model ====================
// Defines the schema for Session documents in MongoDB

import mongoose from "mongoose";

// Session schema definition
const SessionSchema = new mongoose.Schema({
  // Reference to the user for this session
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // The session token string
  token: { type: String, required: true, unique: true },
  // Creation timestamp (expires in 24 hours)
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // 24 hours
});

// Session model
const Session = mongoose.model("Session", SessionSchema);
export default Session;
