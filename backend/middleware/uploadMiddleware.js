import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`);
  },
});

export const floorPlanUpload = multer({
  storage,
  limits: { fileSize: Number(process.env.MAX_UPLOAD_MB || 10) * 1024 * 1024 },
  fileFilter: (req, file, callback) => callback(null, allowedTypes.has(file.mimetype)),
});
