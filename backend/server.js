import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";

import { connectDatabase } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();
const port = Number(process.env.PORT || 7210);

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.get("/api/health", (req, res) =>
  res.json({
    success: true,
    data: {
      service: "dream-house-api",
      status: "ok",
    },
  })
);

app.use(
  "/uploads",
  express.static(
    path.resolve(
      process.cwd(),
      process.env.UPLOAD_DIR || "uploads"
    )
  )
);

/* =========================
   API ROUTES
========================= */

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/admin", adminRoutes);

/* =========================
   ERROR HANDLING
========================= */

app.use(notFound);

app.use(errorHandler);

/* =========================
   DATABASE + SERVER
========================= */

connectDatabase()
  .then(() =>
    app.listen(port, () => {
      console.log(
        `Dream House API listening on http://localhost:${port}`
      );
    })
  )
  .catch((error) => {
    console.error("Unable to start backend:", error.message);
    process.exitCode = 1;
  });