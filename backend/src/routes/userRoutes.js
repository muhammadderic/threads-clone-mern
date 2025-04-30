import express from "express";
const router = express.Router();

// API route controllers
import {
  signupUser,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";

// User routes
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;