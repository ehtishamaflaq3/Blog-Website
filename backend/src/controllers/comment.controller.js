import { blogCollection } from "../models/blog.model.js";
import { commentCollection } from "../models/comment.model.js";
import mongoose from "mongoose";

// create comments
export const createComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.id;
    const { content } = req.body ?? {};
    if (!mongoose.isValidObjectId(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID.",
      });
    }
    // check comment is empty
    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment canot be empty",
      });
    }
    if (content.trim().length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Comment must be at most 5000 characters.",
      });
    }
    // find the blog
    const blog = await blogCollection.findOne({
      _id: blogId,
      isPublished: { $ne: false },
    });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    // create a new comment
    const comment = await commentCollection.create({
      content: content.trim(),
      authorId: userId,
      blogId: blogId,
    });
    blog.comments.push(comment._id);
    await blog.save();
    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error creating comment.",
    });
  }
};
// Get Comments Of A Blog
export const getCommentsOfPost = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    if (!mongoose.isValidObjectId(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID.",
      });
    }
    const blog = await blogCollection
      .findOne({ _id: blogId, isPublished: { $ne: false } })
      .select("_id");
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }
    // Find all comments of this blog
    const comments = await commentCollection
      .find({ blogId: blogId })
      .populate({
        path: "authorId",
        select: "firstName lastName photoUrl",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log("GET COMMENTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching comments.",
    });
  }
};

export const getCommentsOnOwnBlogs = async (req, res) => {
  try {
    const ownBlogs = await blogCollection
      .find({ author: req.id })
      .select("_id title");
    const comments = await commentCollection
      .find({ blogId: { $in: ownBlogs.map((blog) => blog._id) } })
      .populate({
        path: "authorId",
        select: "firstName lastName photoUrl",
      })
      .populate({
        path: "blogId",
        select: "title",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log("GET OWN COMMENTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching comments.",
    });
  }
};

// Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.id;
    if (!mongoose.isValidObjectId(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID.",
      });
    }
    // Find the comment
    const comment = await commentCollection.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }
    const blog = await blogCollection.findById(comment.blogId).select("author");
    const isCommentAuthor = comment.authorId.toString() === userId;
    const isBlogAuthor = blog?.author?.toString() === userId;
    if (!isCommentAuthor && !isBlogAuthor) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this comment.",
      });
    }
    // Delete comment from Comment collection
    await commentCollection.findByIdAndDelete(commentId);
    // Remove comment ID from Blog document
    await blogCollection.findByIdAndUpdate(comment.blogId, {
      $pull: { comments: commentId },
    });
    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.log("DELETE COMMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting comment.",
    });
  }
};
// Edit Comment
export const editComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.id;
    const { content } = req.body ?? {};
    if (!mongoose.isValidObjectId(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID.",
      });
    }
    // Check whether content is empty
    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty.",
      });
    }
    if (content.trim().length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Comment must be at most 5000 characters.",
      });
    }
    // Find the comment
    const comment = await commentCollection.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }
    // Check comment ownership
    if (comment.authorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this comment.",
      });
    }
    // Update comment content
    comment.content = content.trim();
    await comment.save();
    return res.status(200).json({
      success: true,
      message: "Comment updated successfully.",
      comment,
    });
  } catch (error) {
    console.log("EDIT COMMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating comment.",
    });
  }
};
// Like / Unlike Comment
export const likeComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.id;
    if (!mongoose.isValidObjectId(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID.",
      });
    }
    // Find comment
    const comment = await commentCollection.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    // Check whether user already liked the comment
    const alreadyLiked = comment.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      // Unlike comment
      comment.likes.pull(userId);
    } else {
      // Like comment
      comment.likes.addToSet(userId);
    }
    comment.numberOfLikes = comment.likes.length;
    // Save changes
    await comment.save();
    return res.status(200).json({
      success: true,
      message: alreadyLiked
        ? "Comment unliked successfully."
        : "Comment liked successfully.",
      numberOfLikes: comment.numberOfLikes,
      isLiked: !alreadyLiked,
    });
  } catch (error) {
    console.log("LIKE COMMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error liking comment.",
    });
  }
};
