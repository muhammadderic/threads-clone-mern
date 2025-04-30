import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/v1', routes);

export default app;