import express from "express";
const router = express.Router();

import {
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";
import upload from "../middlewares/upload.js";

// Post routes
router.get("/:id", getPost);
router.post("/create", protectRoute, upload.single("img"), createPost);
router.put("/edit/:id", protectRoute, upload.single("img"), updatePost);
router.delete("/:id", protectRoute, deletePost);

export default router;