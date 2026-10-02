import fs from "node:fs/promises";
import { analyzeImage } from "./geminiService.js";

export async function recognizeFloorPlan(file) {
  const buffer = await fs.readFile(file.path);
  return analyzeImage({ ...file, buffer });
}
