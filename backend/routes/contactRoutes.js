import { Router } from "express";

import {
  createContactMessage,
} from "../controllers/contactController.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/",
  asyncHandler(createContactMessage)
);

export default router;