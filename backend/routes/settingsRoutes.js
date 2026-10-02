import { Router } from "express";
import { getPublicSettings } from "../controllers/settingsController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.get("/public", asyncHandler(getPublicSettings));
export default router;
