import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
export const commentCollection = mongoose.model("Comment", commentSchema);