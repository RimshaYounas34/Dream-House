import Project from "../models/Project.js";
import { normalizePlan } from "../utils/planValidation.js";
import { createDxf } from "../services/dxfService.js";
import { createPdf } from "../services/pdfService.js";

async function getOwned(req) {
  return Project.findOne({ _id: req.params.id, user: req.user._id });
}

function fileName(name, extension) {
  return `${String(name || "dream-house").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "dream-house"}.${extension}`;
}

export async function exportDxf(req, res) {
  const project = await getOwned(req);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });
  const content = createDxf(normalizePlan(project.floorPlanData));
  res.setHeader("Content-Type", "application/dxf");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName(project.name, "dxf")}"`);
  res.send(content);
}

export async function exportPdf(req, res) {
  const project = await getOwned(req);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });
  const buffer = await createPdf(normalizePlan(project.floorPlanData));
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName(project.name, "pdf")}"`);
  res.send(buffer);
}
