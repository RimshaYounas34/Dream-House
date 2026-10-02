import AiUsage from "../models/AiUsage.js";

// Logging kabhi bhi asli request ko fail nahi karni chahiye, is liye errors ignore hote hain.
export async function logAiUsage(req, { feature, action, prompt = "", success = true, errorMessage = "", startedAt = Date.now() }) {
  try {
    await AiUsage.create({
      user: req.user?._id || null,
      userName: req.user?.name || "Guest",
      email: req.user?.email || "",
      feature,
      action,
      prompt: String(prompt || "").slice(0, 500),
      success,
      errorMessage: String(errorMessage || "").slice(0, 300),
      durationMs: Date.now() - startedAt,
    });
  } catch (error) {
    console.error("AI usage log failed:", error.message);
  }
}

// Gemini ke operations se feature ka naam nikalta hai
export function featureFromOperations(operations = []) {
  const types = operations.map((op) => op?.type);
  if (types.includes("add_room")) return "Add Room Commands";
  if (types.includes("remove_room")) return "Delete Room Commands";
  if (types.some((t) => ["move_room", "resize_room"].includes(t))) return "Move Room Commands";
  return "AI Edit Commands";
}
