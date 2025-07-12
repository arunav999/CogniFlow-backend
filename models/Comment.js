import mongoose from "mongoose";

const refType = mongoose.Schema.Types.ObjectId;

const commentSchema = new mongoose.Schema(
  {
    comment: { type: String },
    commentedBy: { type: refType, ref: "User" },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
