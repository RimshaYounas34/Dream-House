import { Router } from "express";
import { getTemplate, listTemplates } from "../controllers/templateController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
// Public: Templates page bina login ke bhi dekh sakte hain
router.get("/", asyncHandler(listTemplates));
router.get("/:slug", asyncHandler(getTemplate));
export default router;
