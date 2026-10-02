import { Router } from "express";
import rateLimit from "express-rate-limit";
import { analyzeImage, generate, modify } from "../controllers/aiController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";
import { floorPlanUpload } from "../middleware/uploadMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const aiLimit = rateLimit({ windowMs: 60 * 1000, limit: 20, standardHeaders: "draft-8", legacyHeaders: false });
// AI ke liye login zaroori nahi (rate limit laga hua hai: 20 requests/minute)
// Production me dobara requireAuth lagana behtar hai.
router.use(optionalAuth, aiLimit);
router.post("/generate", asyncHandler(generate));
router.post("/modify-floorplan", asyncHandler(modify));
router.post("/analyze-image", floorPlanUpload.single("image"), asyncHandler(analyzeImage));
export default router;
