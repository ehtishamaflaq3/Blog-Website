import { blogCollection } from "../models/blog.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

// create blog
export const createBlog = async (req, res) => {
  try {
    const { title, category, subTitle } = req.body;
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
    const { title, subTitle, description, category } = req.body;
    const file = req.file;
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
      Object.entries({ title, subTitle, description, category }).filter(
        ([, value]) => value !== undefined,
      ),
    );
    if (thumbnail?.secure_url) updateData.thumbnail = thumbnail.secure_url;
    blog = await blogCollection.findByIdAndUpdate(blogId, updateData, {
      new: true,
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
    const blog = await blogCollection.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }
    if (blog.author.toString() !== req.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this blog.",
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
