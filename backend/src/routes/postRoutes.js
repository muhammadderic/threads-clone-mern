import express from "express";
const router = express.Router();

import {
  getFeedPosts,
  getPost,
  getUserPosts,
  createPost,
  updatePost,
  likeUnlikePost,
  replyToPost,
  deletePost,
} from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";
import upload from "../middlewares/upload.js";

// Post routes
router.get("/feed", protectRoute, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute, upload.single("img"), createPost);
router.put("/edit/:id", protectRoute, upload.single("img"), updatePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);
router.delete("/:id", protectRoute, deletePost);

export default router;