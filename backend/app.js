
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";

import { connectDatabase } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
];

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Connect MongoDB before processing API requests
app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(503).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    data: {
      service: "dream-house-api",
      status: "ok",
    },
  });
});

app.use(
  "/uploads",
  express.static(
    path.resolve(
      process.cwd(),
      process.env.UPLOAD_DIR || "uploads"
    )
  )
);

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
