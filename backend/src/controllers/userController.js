import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendResponse } from "../utils/sendResponse.js";

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