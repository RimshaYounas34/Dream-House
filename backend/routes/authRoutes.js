import { Router } from "express";

import {
  login,
  me,
  register,
  googleLogin,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import { requireAuth } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// ============================================================
// AUTH
// ============================================================

router.post(
  "/register",
  asyncHandler(register)
);

router.post(
  "/login",
  asyncHandler(login)
);

router.post(
  "/google",
  asyncHandler(googleLogin)
);

// ============================================================
// FORGOT / RESET PASSWORD
// ============================================================

router.post(
  "/forgot-password",
  asyncHandler(forgotPassword)
);

router.post(
  "/reset-password",
  asyncHandler(resetPassword)
);

// ============================================================
// CURRENT USER
// ============================================================

router.get(
  "/me",
  requireAuth,
  asyncHandler(me)
);

export default router;