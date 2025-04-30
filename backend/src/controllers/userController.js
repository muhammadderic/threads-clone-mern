import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateTokenAndSetCookie from "../helpers/generateTokenAndSetCookie.js";
import { sendResponse } from "../utils/sendResponse.js";
import { uploadImage } from "../utils/uploadImage.js";

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


export {
  signupUser,
  loginUser,
  logoutUser,
  updateUser,
}