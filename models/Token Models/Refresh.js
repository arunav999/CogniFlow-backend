import mongoose from "mongoose";

const RefreshSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: 2592000 }, // 30 days
});

const RefreshToken = mongoose.model("Refresh Token", RefreshSchema);
export default RefreshToken;
