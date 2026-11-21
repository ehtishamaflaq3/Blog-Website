import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 100 },
    subTitle: { type: String, required: true, maxlength: 180 },
    description: { type: String },
    thumbnail: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    category: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
);
export const blogCollection = mongoose.model("Blog",blogSchema);
