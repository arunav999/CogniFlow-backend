import mongoose from "mongoose";

const RefreshSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "30d" },
});

const RefreshToken = mongoose.model("Refresh Token", RefreshSchema);
export default RefreshToken;
