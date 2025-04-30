import express from "express";
const router = express.Router();

// Import route modules
import userRoutes from "./userRoutes.js";

// API Routes
router.use('/users', userRoutes);

export default router;