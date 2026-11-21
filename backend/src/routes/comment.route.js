import express from "express";
import {
  createComment,
  getCommentsOfPost,
  getCommentsOnOwnBlogs,
  deleteComment,
  editComment,
  likeComment,
} from "../controllers/comment.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const commentRouter = express.Router();
commentRouter.get("/my", isAuthenticated, getCommentsOnOwnBlogs);
// Create Comment
commentRouter.post("/:blogId/create", isAuthenticated, createComment);
// Get Comments Of A Blog
commentRouter.route("/:blogId/comment/all").get(getCommentsOfPost);
// Delete Comment
commentRouter.delete("/:commentId/delete", isAuthenticated, deleteComment);
// Edit Comment
commentRouter.put("/:commentId/edit", isAuthenticated, editComment);
// Like / Unlike Comment
commentRouter.post("/:commentId/like", isAuthenticated, likeComment);
export default commentRouter;