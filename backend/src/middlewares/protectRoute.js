import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendResponse } from "../utils/sendResponse.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) return sendResponse(res, {
      status: 401,
      success: false,
      message: "Unauthorized access — token missing",
    });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      return sendResponse(res, {
        status: 401,
        success: false,
        message: "Unauthorized — invalid token payload",
      });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return sendResponse(res, {
        status: 401,
        success: false,
        message: "Unauthorized — user not found",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log("Error in protectRoute middleware: ", err.message);
    return sendResponse(res, {
      status: 401,
      success: false,
      message: "Authentication failed — invalid or expired token",
      error: err.message,
    });
  }
};

export default protectRoute;
