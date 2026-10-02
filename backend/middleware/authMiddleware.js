import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";

    const token = header.startsWith("Bearer ")
      ? header.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.sub).select(
      "name email role"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Session expired"
        : "Invalid authentication token";

    return res.status(401).json({
      success: false,
      message,
    });
  }
}

/*
 * Admin authentication
 *
 * Pehle check karega ke user logged in hai.
 * Phir check karega ke uska role "admin" hai.
 */
export async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";

    const token = header.startsWith("Bearer ")
      ? header.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.sub).select(
      "name email role"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Session expired"
        : "Invalid authentication token";

    return res.status(401).json({
      success: false,
      message,
    });
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";

    const token = header.startsWith("Bearer ")
      ? header.slice(7)
      : null;

    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(payload.sub).select(
        "name email role"
      );

      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Invalid/expired token ko ignore karo.
    // Request phir bhi continue karegi.
  }

  next();
}