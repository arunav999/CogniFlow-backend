import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: "24h" },
});

const Session = mongoose.model("Session", SessionSchema);
export default Session;
