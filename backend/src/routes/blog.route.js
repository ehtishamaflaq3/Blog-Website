import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getOwnBlogById,
  updateblog,
  getOwnBlogs,
  deleteBlog,
  toggleLike,
} from "../controllers/blog.controller.js";
import { singleUpload } from "../middleware/multer.js";

const blogRouter = express.Router();
blogRouter.route("/create-blog").post(isAuthenticated, createBlog);
blogRouter.route("/all-blogs").get(getAllBlogs);
blogRouter.route("/your-blog").get(isAuthenticated, getOwnBlogs);
blogRouter.route("/my/:blogId").get(isAuthenticated, getOwnBlogById);
blogRouter
  .route("/:blogId")
  .get(getBlogById)
  .put(isAuthenticated, singleUpload, updateblog);
blogRouter.route("/delete/:id").delete(isAuthenticated, deleteBlog);
blogRouter.route("/:blogId/like").post(isAuthenticated, toggleLike);

export default blogRouter;
