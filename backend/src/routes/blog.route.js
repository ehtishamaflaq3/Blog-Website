import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  createBlog,
  getBlogById,
  updateblog,
  getOwnBlogs,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { singleUpload } from "../middleware/multer.js";

const blogRouter = express.Router();
blogRouter.route("/create-blog").post(isAuthenticated, createBlog);
blogRouter.route("/your-blog").get(isAuthenticated, getOwnBlogs);
blogRouter
  .route("/:blogId")
  .get(isAuthenticated, getBlogById)
  .put(isAuthenticated, singleUpload, updateblog);
blogRouter.route("/delete/:id").delete(isAuthenticated, deleteBlog);

export default blogRouter;