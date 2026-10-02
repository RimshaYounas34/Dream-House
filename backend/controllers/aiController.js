import fs from "node:fs/promises";

import {
  generatePlan,
  modifyPlan,
} from "../services/geminiService.js";

import { recognizeFloorPlan } from "../services/imageRecognitionService.js";

import { validatePlan } from "../utils/planValidation.js";

import { applyOperations } from "../utils/planOperations.js";

import { logAiUsage, featureFromOperations } from "../utils/aiUsageLogger.js";

function validatedPlan(result) {
  const checked = validatePlan(result);

  if (!checked.valid) {
    const error = new Error(checked.message);
    error.statusCode = 422;
    error.expose = true;
    throw error;
  }

  return checked.plan;
}

/**
 * Generate a brand-new house plan
 */
async function generateHandler(req, res) {
  const prompt = req.body?.prompt?.trim();

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "Prompt is required",
    });
  }

  // regenerate = true  ->  user ne Regenerate dabaya, AI naya layout banaye
  const generatedResult = await generatePlan(prompt, {
    regenerate: Boolean(req.body?.regenerate),
  });

  const plan = validatedPlan(generatedResult);

  res.json({
    success: true,

    // Main plan
    plan,

    // Frontend apiRequest compatibility
    data: plan,

    operations: [],

    message: "Architectural plan generated",

    // AI message for the chat
    reply:
      generatedResult?.reply ||
      "Done. I created your initial house plan.",
  });
}

/**
 * Modify the existing house plan using a natural-language command.
 *
 * Example:
 *
 * "Make the master bedroom bigger"
 * "Add two balconies"
 * "Move the kitchen near the living room"
 * "Remove the garage"
 */
async function modifyHandler(req, res) {
  const command = req.body?.command?.trim();

  if (!command) {
    return res.status(400).json({
      success: false,
      message: "Command is required",
    });
  }

  /*
   * This is the most important part of the AI agent.
   *
   * The frontend sends the CURRENT version of the house.
   * Gemini receives that current plan and decides what
   * operations need to be performed.
   */
  const currentPlan = validatedPlan(
    req.body?.floorPlanData || {}
  );

  /*
   * Gemini converts the natural-language command into
   * structured operations.
   */
  const aiResult = await modifyPlan(
    command,
    currentPlan
  );

  const operations = Array.isArray(aiResult?.operations)
    ? aiResult.operations
    : [];

  // usage logger is se feature ka naam nikalta hai
  res.locals.operations = operations;

  /*
   * Apply Gemini's operations to the current plan.
   *
   * This produces the NEW version of the house.
   */
  const updatedPlan = applyOperations(
    currentPlan,
    operations
  );

  /*
   * Validate the final plan again.
   *
   * This prevents invalid room/wall/door/window/
   * furniture data from being returned to the frontend.
   */
  const checkedUpdatedPlan = validatedPlan(
    updatedPlan
  );

  /*
   * IMPORTANT:
   *
   * data is now the actual updated plan.
   *
   * This matches the new AIPlanner.jsx:
   *
   * const updatedPlanResponse =
   *     await modifyFloorPlan(command, currentPlan);
   *
   * updatedPlanResponse.rooms
   * updatedPlanResponse.walls
   * updatedPlanResponse.doors
   * etc.
   */
  res.json({
    success: true,

    plan: checkedUpdatedPlan,

    data: {
      ...checkedUpdatedPlan,

      /*
       * The frontend can show this directly
       * inside the AI chat.
       */
      reply:
        aiResult?.reply ||
        "Done. I updated your floor plan.",

      operations,
    },

    operations,

    reply:
      aiResult?.reply ||
      "Done. I updated your floor plan.",

    message: "Architectural plan updated",
  });
}

/**
 * Analyze an uploaded floor-plan image
 */
async function analyzeImageHandler(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message:
        "A PNG, JPG, or WEBP image is required",
    });
  }

  try {
    const result = await recognizeFloorPlan(
      req.file
    );

    const plan = validatedPlan(result);

    res.json({
      success: true,

      plan,

      data: plan,

      reply:
        "I analyzed the floor plan image successfully.",
    });
  } finally {
    /*
     * Remove temporary uploaded image.
     */
    await fs
      .unlink(req.file.path)
      .catch(() => {});
  }
}

/* =========================================================
   USAGE LOGGING
   Har successful / failed AI request AiUsage collection me
   save hoti hai (Admin -> AI Usage aur Reports pages ke liye)
========================================================= */
function withUsageLog(handler, describe) {
  return async (req, res, next) => {
    const startedAt = Date.now();

    try {
      await handler(req, res, next);

      // 400 jaisi validation errors (empty prompt etc.) log nahi hoti
      if (res.statusCode < 400) {
        await logAiUsage(req, { ...describe(req, res), success: true, startedAt });
      }
    } catch (error) {
      await logAiUsage(req, {
        ...describe(req, res),
        success: false,
        errorMessage: error.message,
        startedAt,
      });

      throw error;
    }
  };
}

export const generate = withUsageLog(generateHandler, (req) => ({
  feature: "AI Floor Plan Generator",
  action: "generate",
  prompt: req.body?.prompt,
}));

export const modify = withUsageLog(modifyHandler, (req, res) => ({
  feature: featureFromOperations(res.locals.operations || []),
  action: "edit-command",
  prompt: req.body?.command,
}));

export const analyzeImage = withUsageLog(analyzeImageHandler, () => ({
  feature: "Image Analysis",
  action: "analyze-image",
}));

/**
 * 3D Generation backend ka AI call nahi hai, is liye frontend
 * jab 3D view generate kare to POST /api/ai/usage { feature: "3D Generation" } bheje.
 */
export async function track3dGeneration(req, res) {
  await logAiUsage(req, { feature: "3D Generation", action: "3d-generate" });
  res.status(201).json({ success: true });
}
