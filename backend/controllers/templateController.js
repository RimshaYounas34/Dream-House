import Template from "../models/Template.js";
import { httpError } from "../utils/adminHelpers.js";
import { validatePlan } from "../utils/planValidation.js";

const slugify = (text) => String(text).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// ---------- Public ----------
// GET /api/templates
export async function listTemplates(req, res) {
  const templates = await Template.find({ isPublished: true }).sort({ sortOrder: 1, createdAt: 1 });
  res.json({ success: true, data: templates });
}

// GET /api/templates/:slug
export async function getTemplate(req, res) {
  const template = await Template.findOne({ slug: req.params.slug, isPublished: true });
  if (!template) throw httpError(404, "Template not found");
  res.json({ success: true, data: template });
}

// ---------- Admin ----------
// GET /api/admin/templates   (draft bhi nazar aate hain)
export async function adminListTemplates(req, res) {
  const templates = await Template.find().sort({ sortOrder: 1, createdAt: 1 });
  res.json({ success: true, data: templates });
}

// POST /api/admin/templates
export async function createTemplate(req, res) {
  const { name, size, style, rooms, floorPlanData, isPublished, sortOrder, slug } = req.body || {};
  if (!name?.trim()) throw httpError(400, "Template name is required");

  const checked = validatePlan(floorPlanData || {});
  if (!checked.valid) throw httpError(400, checked.message);

  const finalSlug = slugify(slug || name);
  if (await Template.findOne({ slug: finalSlug })) throw httpError(409, "A template with that slug already exists");

  const template = await Template.create({
    slug: finalSlug,
    name: name.trim(),
    size: size || "",
    style: style || "",
    rooms: Array.isArray(rooms) ? rooms.map(String) : [],
    floorPlanData: { ...checked.plan, source: "template" },
    isPublished: isPublished !== false,
    sortOrder: Number(sortOrder) || 0,
  });
  res.status(201).json({ success: true, data: template });
}

// PUT /api/admin/templates/:id
export async function updateTemplate(req, res) {
  const template = await Template.findById(req.params.id);
  if (!template) throw httpError(404, "Template not found");

  const { name, size, style, rooms, floorPlanData, isPublished, sortOrder } = req.body || {};
  if (name !== undefined) template.name = String(name).trim();
  if (size !== undefined) template.size = String(size);
  if (style !== undefined) template.style = String(style);
  if (Array.isArray(rooms)) template.rooms = rooms.map(String);
  if (typeof isPublished === "boolean") template.isPublished = isPublished;
  if (sortOrder !== undefined) template.sortOrder = Number(sortOrder) || 0;

  if (floorPlanData) {
    const checked = validatePlan(floorPlanData);
    if (!checked.valid) throw httpError(400, checked.message);
    template.floorPlanData = { ...checked.plan, source: "template" };
  }

  await template.save();
  res.json({ success: true, data: template });
}

// DELETE /api/admin/templates/:id
export async function deleteTemplate(req, res) {
  const template = await Template.findById(req.params.id);
  if (!template) throw httpError(404, "Template not found");
  await template.deleteOne();
  res.json({ success: true, data: { id: req.params.id } });
}
