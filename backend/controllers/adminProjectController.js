import Project from "../models/Project.js";
import ProjectVersion from "../models/ProjectVersion.js";
import { THREE_D_FILTER, escapeRegex, has3D, httpError, parsePaging, projectType } from "../utils/adminHelpers.js";

function serialize(project) {
  const plan = project.floorPlanData || {};
  return {
    id: project._id,
    name: project.name,
    description: project.description,
    user: project.user ? { id: project.user._id, name: project.user.name, email: project.user.email } : null,
    type: projectType(plan.source),
    has3D: has3D(plan),
    rooms: plan.rooms?.length || 0,
    thumbnail: project.thumbnail,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

// GET /api/admin/projects?search=&type=2D|AI|Template|3D&userId=&page=&limit=
export async function listAllProjects(req, res) {
  const { search, type, userId } = req.query;
  const { page, limit, skip } = parsePaging(req.query, 20, 100);

  const filter = {};
  if (search) filter.name = new RegExp(escapeRegex(String(search).trim()), "i");
  if (userId) filter.user = userId;
  if (type === "AI") filter["floorPlanData.source"] = { $in: ["ai-planner", "ai"] };
  else if (type === "Template") filter["floorPlanData.source"] = "template";
  else if (type === "2D") filter["floorPlanData.source"] = { $nin: ["ai-planner", "ai", "template"] };
  else if (type === "3D") Object.assign(filter, THREE_D_FILTER);

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email")
      .select("name description thumbnail user createdAt updatedAt floorPlanData.source floorPlanData.rooms floorPlanData.exterior floorPlanData.roof"),
    Project.countDocuments(filter),
  ]);

  res.json({ success: true, data: projects.map(serialize), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

// GET /api/admin/projects/:id  (poora floorPlanData ke saath)
export async function getAnyProject(req, res) {
  const project = await Project.findById(req.params.id).populate("user", "name email");
  if (!project) throw httpError(404, "Project not found");
  res.json({ success: true, data: { ...serialize(project), floorPlanData: project.floorPlanData } });
}

// DELETE /api/admin/projects/:id
export async function deleteAnyProject(req, res) {
  const project = await Project.findById(req.params.id);
  if (!project) throw httpError(404, "Project not found");
  await ProjectVersion.deleteMany({ project: project._id });
  await project.deleteOne();
  res.json({ success: true, data: { id: req.params.id } });
}
