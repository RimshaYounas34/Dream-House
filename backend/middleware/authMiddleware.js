import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: "Authentication required" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("name email role");
    if (!user) return res.status(401).json({ success: false, message: "User no longer exists" });

    req.user = user;
    next();
  } catch (error) {
    const message = error.name === "TokenExpiredError" ? "Session expired" : "Invalid authentication token";
    res.status(401).json({ success: false, message });
  }
}

// Login ZAROORI nahi. Token ho aur sahi ho to user mil jata hai,
// warna request bina user ke aage chali jati hai.
// AI planner ke liye use hota hai taake bina login bhi kaam kare.
export async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.sub).select("name email role");
      if (user) req.user = user;
    }
  } catch (error) {
    // Token galat / expire hai to ignore karo, request phir bhi chalne do
  }

  next();
}
