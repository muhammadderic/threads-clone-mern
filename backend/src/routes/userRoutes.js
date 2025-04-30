import express from "express";
const router = express.Router();

// User routes
router.post("/signup", signupUser);

export default router;