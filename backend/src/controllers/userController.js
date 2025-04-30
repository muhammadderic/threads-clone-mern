import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateTokenAndSetCookie from "../helpers/generateTokenAndSetCookie.js";
import { sendResponse } from "../utils/sendResponse.js";
import { uploadImage } from "../utils/uploadImage.js";
import { freezeToggleAccount } from "../helpers/userHelpers.js";

// Get user profile (GET /users/:query)
const getUserProfile = async (req, res) => {
  const { query } = req.params;

  try {
    const user = await User.findOne({ username: query }).select("-password -updatedAt");

    if (!user) return sendResponse(res, {
      status: 404,
      success: false,
      message: "User not found",
    });

    return sendResponse(res, {
      status: 201,
      success: true,
      message: "Get user successfully",
      data: user,
    });
  } catch (err) {
    console.log("Error in getUserProfile: ", err.message);
    return sendResponse(res, {
      status: 500,
      success: false,
      message: "Get user profile failed",
      error: err.message,
    });
  }
};

// Get all suggested users (GET /suggested)
// (users who follow the current user but are not followed back)
const getSuggestedUsers = async (req, res) => {
  try {
    // exclude the current user from suggested users array and exclude users that current user is already following
    const userId = req.user._id;

    const usersFollowedByYou = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));

    return sendResponse(res, {
      status: 200,
      success: true,
      message: "Get all suggested users successfully",
      data: suggestedUsers
    });
  } catch (err) {
    console.log("Error in getSuggestedUsers: ", err.message);
    return sendResponse(res, {
      status: 500,
      success: false,
      message: "Get all suggested users failed",
      error: err.message,
    });
  }
};

// Create a user (sign up) (POST /signup)
const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return sendResponse(res, {
        status: 400,
        success: false,
        message: "User already exists",
        error: "A user with that email or username already exists"
      });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new User instance and save it
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    if (newUser) {
      // Generate auth token and set it as a cookie
      generateTokenAndSetCookie(newUser._id, res);

      return sendResponse(res, {
        status: 201,
        success: true,
        message: "User created successfully",
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
        }
      });
    } else {
      return sendResponse(res, {
        status: 400,
        success: false,
        message: "User creation failed",
        error: "Invalid user data",
      });
    }
  } catch (err) {
    console.log("Error in signupUser: ", err.message);
    return sendResponse(res, {
      status: 500,
      success: false,
      message: "User signup failed",
      error: err.message,
    });
  }
};

// Log in (POST /login)
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
    if (!user || !isPasswordCorrect) return sendResponse(res, {
      status: 400,
      success: false,
      message: "Invalid username or password",
    });

    // Unfreeze the user account if it was frozen
    await freezeToggleAccount(user);

    generateTokenAndSetCookie(user._id, res);

    return sendResponse(res, {
      status: 200,
      success: true,
      message: "User login successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio,
        profilePic: user.profilePic,
      }
    });
  } catch (err) {
    console.log("Error in loginUser: ", err.message);
    return sendResponse(res, {
      status: 500,
      success: false,
      message: "User login failed",
      error: err.message,
    });
  }
};

// Log out (POST /logout)
const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });

    return sendResponse(res, {
      status: 200,
      success: true,
      message: "User logged out successfully",
    });
  } catch (err) {
    console.log("Error in logoutUser: ", err.message);
    return sendResponse(res, {
      status: 500,
      success: false,
      message: "User logout failed",
      error: err.message,
    });
  }
};

// Toggle: follow and unfollow other users (POST /follow/:id)
const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Bad Request: You cannot follow or unfollow yourself",
        error: "User attempted to follow/unfollow themselves",
      });
    }

    if (!userToModify || !currentUser) return sendResponse(res, {
      status: 400,
      success: false,
      message: "User not found",
    });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({
        success: true,
        status: 200,
        message: "User has been unfollowed successfully",
      });
    } else {
      // Follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({
        success: true,
        status: 200,
        message: "User has been followed successfully",
      });
    }
  } catch (err) {
    console.log("Error in followUnFollowUser: ", err.message);
    return sendResponse(res, {
      status: 500,
      success: false,
      message: "User followUnFollowUser failed",
      error: err.message,
    });
  }
};

// Update user by ID (PUT /users/:id)
const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  const file = req.file;
  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return sendResponse(res, {
      status: 400,
      success: false,
      message: "User not found",
    });

    if (req.params.id !== userId.toString()) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: "Forbidden: You are not allowed to update another user's profile",
        error: "Access denied due to user mismatch",
      });
    }

    // Handle password update
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Handle image upload
    if (file) {
      if (user.profilePic) {
        const publicId = user.profilePic.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const uploadedUrl = await uploadImage(file.buffer);
      user.profilePic = uploadedUrl;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;

    await user.save();

    // password should be null in response
    user.password = null;

    return sendResponse(res, {
      status: 200,
      success: true,
      message: "User updated successfully",
      data: user
    });
  } catch (err) {
    console.log("Error in updateUser: ", err.message);
    return sendResponse(res, {
      status: 500,
      success: false,
      message: "User updated failed",
      error: err.message,
    });
  }
};

// Freeze user account (PUT /freeze)
const freezeAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendResponse(res, {
        status: 400,
        success: false,
        message: "User not found",
      });
    }

    const result = await freezeToggleAccount(user);

    return sendResponse(res, {
      status: 200,
      success: true,
      message: `User account ${result.status ? "frozen" : "unfrozen"} successfully`,
      data: { isFrozen: result.status }
    });
  } catch (err) {
    console.log("Error in freezeAccount: ", err.message);
    return sendResponse(res, {
      status: 500,
      success: false,
      message: "User account frozen failed",
      error: err.message,
    });
  }
};

// Delete user by ID (DELETE /:id)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmText } = req.body;
    const userId = req.user._id;

    // Check if the requester is deleting their own account
    if (id !== userId.toString()) {
      return sendResponse({
        status: 403,
        success: false,
        message: "Forbidden: You are not allowed to delete another user",
        error: "Access denied due to user mismatch",
      })
    }

    // Validate confirmation text
    const expectedConfirmation = "i agree to delete my account";
    if (confirmText?.toLowerCase() !== expectedConfirmation) {
      return sendResponse({
        success: false,
        status: 400,
        message: "Invalid confirmation text. You must type: 'I agree to delete my account'",
        error: "Confirmation text mismatch",
      })
    }

    // Now delete the user
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return sendResponse(res, {
        status: 400,
        success: false,
        message: "User not found",
      });
    }

    return sendResponse(res, {
      status: 200,
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.log("Error in deleteUser: ", err.message);
    return sendResponse(res, {
      status: 500,
      success: false,
      message: "User deleted failed",
      error: err.message,
    });
  }
};


export {
  getUserProfile,
  getSuggestedUsers,
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  freezeAccount,
  deleteUser,
}