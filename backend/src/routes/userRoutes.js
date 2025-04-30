import express from "express";
const router = express.Router();

// API route controllers
import {
  signupUser,
  loginUser,
} from "../controllers/userController.js";

// User routes
router.post("/signup", signupUser);
router.post("/login", loginUser);

export default router;