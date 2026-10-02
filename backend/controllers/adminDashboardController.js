import User from "../models/User.js";
import Project from "../models/Project.js";
import AiUsage from "../models/AiUsage.js";
import Template from "../models/Template.js";
import { THREE_D_FILTER, formatChange, initials, monthRange, projectType } from "../utils/adminHelpers.js";

async function countBetween(Model, start, end, extra = {}) {
  return Model.countDocuments({ ...extra, createdAt: { $gte: start, $lt: end } });
}

// GET /api/admin/dashboard
export async function getDashboard(req, res) {
  const thisMonth = monthRange(0);
  const lastMonth = monthRange(-1);
  const year = new Date().getFullYear();

  const [
    totalUsers, totalProjects, total3D, totalAi,
    usersNow, usersPrev, projectsNow, projectsPrev, threeDNow, threeDPrev, aiNow, aiPrev,
    recentUsersRaw, recentProjectsRaw, growthRaw,
    aiProjects, templateProjects, templatesCount,
  ] = await Promise.all([
    User.countDocuments(),
    Project.countDocuments(),
    Project.countDocuments(THREE_D_FILTER),
    AiUsage.countDocuments(),
    countBetween(User, thisMonth.start, thisMonth.end),
    countBetween(User, lastMonth.start, lastMonth.end),
    countBetween(Project, thisMonth.start, thisMonth.end),
    countBetween(Project, lastMonth.start, lastMonth.end),
    countBetween(Project, thisMonth.start, thisMonth.end, THREE_D_FILTER),
    countBetween(Project, lastMonth.start, lastMonth.end, THREE_D_FILTER),
    countBetween(AiUsage, thisMonth.start, thisMonth.end),
    countBetween(AiUsage, lastMonth.start, lastMonth.end),
    User.find().sort({ createdAt: -1 }).limit(4).select("name email role createdAt"),
    Project.find().sort({ createdAt: -1 }).limit(4).populate("user", "name email").select("name user floorPlanData.source createdAt"),
    Project.aggregate([
      { $match: { createdAt: { $gte: new Date(year, 0, 1), $lt: new Date(year + 1, 0, 1) } } },
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
    ]),
    Project.countDocuments({ "floorPlanData.source": { $in: ["ai-planner", "ai"] } }),
    Project.countDocuments({ "floorPlanData.source": "template" }),
    Template.countDocuments({ isPublished: true }),
  ]);

  // Har recent user ke projects ki ginti
  const counts = await Project.aggregate([
    { $match: { user: { $in: recentUsersRaw.map((u) => u._id) } } },
    { $group: { _id: "$user", count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));

  const projectGrowth = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(year, i, 1).toLocaleString("en-US", { month: "short" }),
    count: growthRaw.find((g) => g._id === i + 1)?.count || 0,
  }));

  const share = (n) => (totalProjects ? Math.round((n / totalProjects) * 100) : 0);

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers: { value: totalUsers, change: formatChange(usersNow, usersPrev) },
        totalProjects: { value: totalProjects, change: formatChange(projectsNow, projectsPrev) },
        projects3D: { value: total3D, change: formatChange(threeDNow, threeDPrev) },
        aiRequests: { value: totalAi, change: formatChange(aiNow, aiPrev) },
      },
      recentUsers: recentUsersRaw.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: initials(u.name),
        projects: countMap[String(u._id)] || 0,
        joined: u.createdAt,
      })),
      recentProjects: recentProjectsRaw.map((p) => ({
        id: p._id,
        name: p.name,
        user: p.user?.name || "Deleted user",
        type: projectType(p.floorPlanData?.source),
        createdAt: p.createdAt,
      })),
      projectGrowth,
      // Platform Activity bars: projects ka share (%) jo har feature se bane
      platformActivity: [
        { label: "AI Usage", value: share(aiProjects) },
        { label: "3D Viewer", value: share(total3D) },
        { label: "Floor Planner", value: share(totalProjects - aiProjects - templateProjects) },
        { label: "Templates", value: share(templateProjects) },
      ],
      publishedTemplates: templatesCount,
    },
  });
}
