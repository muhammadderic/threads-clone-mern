import { v2 as cloudinary } from "cloudinary";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { sendResponse } from "../utils/sendResponse.js";
import { uploadImage } from "../utils/uploadImage.js";

// Get all posts by other users (feed) but not itself (GET /feed)
const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return sendResponse(res, {
        status: 404,
        success: false,
        message: "User not found.",
        error: `No user found with ID: ${userId}`
      });
    }

    const following = user.following;

    const feedPosts = await Post.find({ postedBy: { $in: following } })
      .sort({ createdAt: -1 });

    return sendResponse(res, {
      status: 200,
      success: true,
      message: "Feed posts retrieved successfully.",
      data: feedPosts
    });
  } catch (err) {
    console.error("Error fetching feed posts:", err);
    return sendResponse(res, {
      status: 500,
      success: false,
      message: "Internal server error.",
      error: err.message
    });
  }
};

// Get a post by ID (GET /:id)
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return sendResponse(res, {
      status: 404,
      success: false,
      message: "Post not found",
    });

    return sendResponse(res, {
      status: 200,
      success: true,
      message: "Get post successfully",
      data: post
    });
  } catch (err) {
    console.log("Error in getPost: ", err.message);
    return sendResponse(res, {
      status: 500,
      success: false,
      message: "Get post failed",
      error: err.message,
    });
  }
};

// Get all user posts (GET /user/:username)
const getUserPosts = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return sendResponse(res, {
      status: 404,
      success: false,
      message: "User not found",
    });

    const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

    return sendResponse(res, {
      status: 200,
      success: true,
      message: "Get user posts successfully",
      data: posts
    });
  } catch (err) {
    console.log("Error in getPost: ", err.message);
    return sendResponse(res, {
      status: 500,
      success: false,
      message: "Get post failed",
      error: err.message,
    });
  }
};

// Create a post (POST /create)
const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    const file = req.file;
    let { img } = req.body;

    if (!postedBy || !text?.trim()) { // !text?.trim() to avoid blank spaces being passed
      return sendResponse(res, {
        status: 400,
        success: false,
        message: "Missing required fields.",
        error: "The 'postedBy' and 'text' fields are required."
      });
    }

    const user = await User.findById(postedBy);
    if (!user) {
      return sendResponse(res, {
        status: 404,
        success: false,
        message: "User not found.",
        error: `No user found with ID: ${postedBy}`
      });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return sendResponse(res, {
        status: 401,
        success: false,
        message: "Unauthorized action.",
        error: "You are not allowed to create a post on behalf of another user."
      });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return sendResponse(res, {
        status: 400,
        success: false,
        message: "Text too long.",
        error: `Text must be less than ${maxLength} characters.`
      });
    }

    if (file) {
      const uploadedUrl = await uploadImage(file.buffer);
      img = uploadedUrl;
    }

    const newPost = new Post({ postedBy, text, img });
    await newPost.save();

    return sendResponse(res, {
      status: 201,
      success: true,
      message: "Post created successfully.",
      data: newPost
    });
  } catch (err) {
    console.error("Error creating post:", err);
    return sendResponse(res, {
      status: 500,
      success: false,
      message: "Internal server error.",
      error: err.message
    });
  }
};

// Update a post by ID (PUT /edit/:id)
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const file = req.file;

    const post = await Post.findById(id);
    if (!post) {
      return sendResponse(res, {
        status: 404,
        success: false,
        message: "Post not found.",
        error: `No post found with ID: ${id}`,
      });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return sendResponse(res, {
        status: 403,
        success: false,
        message: "Forbidden action.",
        error: "You can only update your own posts.",
      });
    }

    const maxLength = 500;
    if (text && text.length > maxLength) {
      return sendResponse(res, {
        status: 400,
        success: false,
        message: "Text too long.",
        error: `Text must be less than ${maxLength} characters.`,
      });
    }

    if (file) {
      const uploadedUrl = await uploadImage(file.buffer);
      post.img = uploadedUrl;
    }

    if (text !== undefined) post.text = text;

    await post.save();

    return sendResponse(res, {
      status: 200,
      success: true,
      message: "Post updated successfully.",
      data: post,
    });
  } catch (err) {
    console.error("Error updating post:", err);
    return sendResponse(res, {
      status: 500,
      success: false,
      message: "Internal server error.",
      error: err.message,
    });
  }
};

// Delete a post by ID (DELETE /:id)
const deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return sendResponse(res, {
        status: 404,
        success: false,
        message: "Post not found.",
        error: `No post found with ID: ${postId}`,
      });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return sendResponse(res, {
        status: 401,
        success: false,
        message: "Unauthorized action.",
        error: "You are not allowed to delete this post.",
      });
    }

    if (post.img) {
      try {
        const imgId = post.img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imgId);
      } catch (cloudErr) {
        console.warn("Cloudinary deletion failed:", cloudErr.message);
      }
    }

    await Post.findByIdAndDelete(postId);

    return sendResponse(res, {
      status: 200,
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting post:", err);
    return sendResponse(res, {
      status: 500,
      success: false,
      message: "Internal server error.",
      error: err.message,
    });
  }
};

export {
  getFeedPosts,
  getPost,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
}