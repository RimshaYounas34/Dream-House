import Project from "../models/Project.js";
import ProjectVersion from "../models/ProjectVersion.js";
import { normalizePlan, validatePlan } from "../utils/planValidation.js";

async function ownedProject(id, userId) {
  return Project.findOne({ _id: id, user: userId });
}

async function createVersion(project, userId, description) {
  const latest = await ProjectVersion.findOne({ project: project._id }).sort({ versionNumber: -1 });
  return ProjectVersion.create({ project: project._id, versionNumber: (latest?.versionNumber || 0) + 1, floorPlanData: project.floorPlanData.toObject?.() || project.floorPlanData, description: description || "Plan update", createdBy: userId });
}

export async function listProjects(req, res) {
  const projects = await Project.find({ user: req.user._id }).sort({ updatedAt: -1 }).select("name description thumbnail createdAt updatedAt floorPlanData.project");
  res.json({ success: true, data: projects });
}

export async function getProject(req, res) {
  const project = await ownedProject(req.params.id, req.user._id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });
  res.json({ success: true, data: project });
}

export async function createProject(req, res) {
  const { name, description, floorPlanData, thumbnail } = req.body || {};
  const checked = validatePlan(floorPlanData || {});
  if (!checked.valid) return res.status(400).json({ success: false, message: checked.message });
  const project = await Project.create({ user: req.user._id, name: name?.trim() || checked.plan.project.name, description: description || "", thumbnail: thumbnail || "", floorPlanData: checked.plan });
  await createVersion(project, req.user._id, "Initial plan");
  res.status(201).json({ success: true, data: project });
}

export async function updateProject(req, res) {
  const project = await ownedProject(req.params.id, req.user._id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });
  const nextPlan = req.body.floorPlanData ? validatePlan(req.body.floorPlanData) : { valid: true, plan: project.floorPlanData };
  if (!nextPlan.valid) return res.status(400).json({ success: false, message: nextPlan.message });
  if (req.body.name !== undefined) project.name = String(req.body.name).trim().slice(0, 160);
  if (req.body.description !== undefined) project.description = String(req.body.description).slice(0, 2000);
  if (req.body.thumbnail !== undefined) project.thumbnail = String(req.body.thumbnail);
  if (req.body.floorPlanData) project.floorPlanData = nextPlan.plan;
  await project.save();
  if (req.body.createVersion !== false && req.body.floorPlanData) await createVersion(project, req.user._id, req.body.versionDescription || "Plan update");
  res.json({ success: true, data: project });
}

export async function deleteProject(req, res) {
  const project = await ownedProject(req.params.id, req.user._id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });
  await ProjectVersion.deleteMany({ project: project._id });
  await project.deleteOne();
  res.json({ success: true, data: { id: req.params.id } });
}

export async function createVersionEndpoint(req, res) {
  const project = await ownedProject(req.params.id, req.user._id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });
  const checked = validatePlan(req.body?.floorPlanData || project.floorPlanData);
  if (!checked.valid) return res.status(400).json({ success: false, message: checked.message });
  project.floorPlanData = checked.plan;
  await project.save();
  const version = await createVersion(project, req.user._id, req.body?.description);
  res.status(201).json({ success: true, data: version });
}

export async function listVersions(req, res) {
  const project = await ownedProject(req.params.id, req.user._id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });
  const versions = await ProjectVersion.find({ project: project._id }).sort({ versionNumber: -1 }).select("versionNumber description createdAt createdBy");
  res.json({ success: true, data: versions });
}

export async function getVersion(req, res) {
  const project = await ownedProject(req.params.id, req.user._id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });
  const version = await ProjectVersion.findOne({ _id: req.params.versionId, project: project._id });
  if (!version) return res.status(404).json({ success: false, message: "Version not found" });
  res.json({ success: true, data: version });
}

export async function restoreVersion(req, res) {
  const project = await ownedProject(req.params.id, req.user._id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });
  const version = await ProjectVersion.findOne({ _id: req.params.versionId, project: project._id });
  if (!version) return res.status(404).json({ success: false, message: "Version not found" });
  project.floorPlanData = version.floorPlanData;
  await project.save();
  const restored = await createVersion(project, req.user._id, `Restored version ${version.versionNumber}`);
  res.json({ success: true, data: { project, version: restored } });
}
