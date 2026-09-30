import express from 'express';
import {isAuthenticated} from '../middleware/isAuthenticated.js'
import { createBlog, updateblog,getOwnBlogs } from '../controllers/blog.controller.js';
import { singleUpload } from '../middleware/multer.js';

const blogRouter= express.Router();
blogRouter.route("/create-blog").post(isAuthenticated,createBlog);
blogRouter.route("/:blogId").put(isAuthenticated,singleUpload,updateblog);
blogRouter.route("/your-blog").get(isAuthenticated,getOwnBlogs);

export default blogRouter;