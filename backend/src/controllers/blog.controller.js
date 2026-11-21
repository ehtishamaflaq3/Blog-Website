import { blogCollection } from "../models/blog.model.js";
import { commentCollection } from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import mongoose from "mongoose";

// create blog
export const createBlog = async (req, res) => {
  try {
    const { title, category, subTitle } = req.body ?? {};
    if (
      typeof title !== "string" ||
      typeof category !== "string" ||
      typeof subTitle !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, subtitle, and category must be strings.",
      });
    }
    const blogData = {
      title: title?.trim(),
      category: category?.trim(),
      subTitle: subTitle?.trim(),
    };
    if (!blogData.title || !blogData.category || !blogData.subTitle) {
      return res.status(400).json({
        success: false,
        message: "Title, subtitle, and category are required.",
      });
    }
    if (blogData.title.length > 100 || blogData.subTitle.length > 180) {
      return res.status(400).json({
        success: false,
        message: "Title must be at most 100 characters and subtitle at most 180.",
      });
    }

    const existingBlog = await blogCollection.findOne({
      author: req.id,
      ...blogData,
    });
    if (existingBlog) {
      return res.status(409).json({
        success: false,
        message: "This blog has already been created.",
      });
    }

    const blog = await blogCollection.create({
      ...blogData,
      author: req.id,
    });
    return res.status(201).json({
      success: true,
      message: "Blog created Successfully",
      blog,
    });
  } catch (error) {
    console.log("CREATE BLOG ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// updateblog
export const updateblog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    if (!mongoose.isValidObjectId(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID.",
      });
    }
    const { title, subTitle, description, category } = req.body ?? {};
    const file = req.file;
    for (const [field, value] of Object.entries({
      title,
      subTitle,
      description,
      category,
    })) {
      if (value !== undefined && typeof value !== "string") {
        return res.status(400).json({
          success: false,
          message: `${field} must be a string.`,
        });
      }
    }
    if (
      (title !== undefined && !title.trim()) ||
      (subTitle !== undefined && !subTitle.trim()) ||
      (category !== undefined && !category.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, subtitle, and category cannot be empty.",
      });
    }
    if (
      (title !== undefined && title.trim().length > 100) ||
      (subTitle !== undefined && subTitle.trim().length > 180)
    ) {
      return res.status(400).json({
        success: false,
        message: "Title must be at most 100 characters and subtitle at most 180.",
      });
    }
    if (
      title === undefined &&
      subTitle === undefined &&
      description === undefined &&
      category === undefined &&
      !file
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one blog field or thumbnail is required.",
      });
    }

    let blog = await blogCollection.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    if (blog.author.toString() !== req.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this blog.",
      });
    }
    let thumbnail;
    if (file) {
      const fileUri = getDataUri(file);
      thumbnail = await cloudinary.uploader.upload(fileUri);
    }
    const updateData = Object.fromEntries(
      Object.entries({
        title: title?.trim(),
        subTitle: subTitle?.trim(),
        description,
        category: category?.trim(),
      }).filter(([, value]) => value !== undefined),
    );
    if (thumbnail?.secure_url) updateData.thumbnail = thumbnail.secure_url;
    updateData.isPublished = true;
    blog = await blogCollection.findByIdAndUpdate(blogId, updateData, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "Blog Updated Successfully",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error updating blog",
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID.",
      });
    }
    const blog = await blogCollection
      .findOne({ _id: req.params.blogId, isPublished: { $ne: false } })
      .populate({
        path: "author",
        select: "firstName lastName photoUrl",
      });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching blog.",
    });
  }
};

export const getOwnBlogById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID.",
      });
    }
    const blog = await blogCollection.findOne({
      _id: req.params.blogId,
      author: req.id,
    });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }
    await blog.populate({
      path: "author",
      select: "firstName lastName photoUrl",
    });
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching blog.",
    });
  }
};

export const getAllBlogs = async (_req, res) => {
  try {
    const blogs = await blogCollection
      .find({ isPublished: { $ne: false } })
      .populate({
        path: "author",
        select: "firstName lastName photoUrl",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json({ blogs, success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching blogs.",
    });
  }
};

//your all blogs
export const getOwnBlogs = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(400).json({
        message: "User Id is required",
      });
    }
    const blogs = await blogCollection
      .find({ author: userId })
      .populate({
        path: "author",
        select: "firstName lastName photoUrl",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json({ blogs, success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Error Fetching Blogs",
      error: error.message,
    });
  }
};

// deleteblog
export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const authorId = req.id;
    if (!mongoose.isValidObjectId(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID.",
      });
    }
    const blog = await blogCollection.findById(blogId);
    // if blog is not exist
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    // authorized person only delete blog
    if (blog.author.toString() !== authorId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this blog",
      });
    }
    // delete blog after verification
    await blogCollection.findByIdAndDelete(blogId);
    await commentCollection.deleteMany({ blogId });
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};

// Like / Unlike Blog
export const toggleLike = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.id;
    if (!mongoose.isValidObjectId(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID.",
      });
    }
    // Check whether blog exists
    const blog = await blogCollection.findOne({
      _id: blogId,
      isPublished: { $ne: false },
    });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }
    // Check whether current user has already liked this blog
    const alreadyLiked = blog.likes.some(
      (like) => like.toString() === userId
    );
    if (alreadyLiked) {
      // Remove user's ID from likes array
      blog.likes.pull(userId);
    } else {
      // Add user's ID to likes array
      blog.likes.addToSet(userId);
    }
    await blog.save();
    return res.status(200).json({
      success: true,
      message: alreadyLiked
        ? "Blog unliked successfully."
        : "Blog liked successfully.",
      likeCount: blog.likes.length,
      isLiked: !alreadyLiked,
    });
  } catch (error) {
    console.log("TOGGLE LIKE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error while liking blog.",
    });
  }
};
