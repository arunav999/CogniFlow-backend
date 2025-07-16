// ==================== Refresh Token Model ====================
// Defines the schema for Refresh Token documents in MongoDB

import mongoose from "mongoose";

// Refresh token schema definition
const RefreshSchema = new mongoose.Schema({
  // Reference to the user for this refresh token
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // The refresh token string
  token: { type: String, required: true, unique: true },
  // Creation timestamp (expires in 30 days)
  createdAt: { type: Date, default: Date.now, expires: 2592000 }, // 30 days
});

// RefreshToken model
const RefreshToken = mongoose.model("Refresh Token", RefreshSchema);
export default RefreshToken;
