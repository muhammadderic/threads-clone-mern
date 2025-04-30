import express from "express";
const router = express.Router();

// API route controllers
import {
  signupUser,
  loginUser,
  logoutUser,
  updateUser,
  freezeAccount,
  deleteUser,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";
import upload from "../middlewares/upload.js";

// User routes
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/update/:id", protectRoute, upload.single("profilePic"), updateUser);
router.put("/freeze", protectRoute, freezeAccount);
router.delete("/:id", protectRoute, deleteUser);

export default router;