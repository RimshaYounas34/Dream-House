import User from "../models/User.js";
import Project from "../models/Project.js";
import AiUsage from "../models/AiUsage.js";
import { daysAgo, dayKey, httpError, projectType, toCsv } from "../utils/adminHelpers.js";

async function perDay(Model, since, days, match = {}) {
  const rows = await Model.aggregate([
    { $match: { ...match, createdAt: { $gte: since } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
  ]);
  const map = Object.fromEntries(rows.map((r) => [r._id, r.count]));
  return Array.from({ length: days }, (_, i) => {
    const key = dayKey(daysAgo(days - 1 - i));
    return { date: key, count: map[key] || 0 };
  });
}

// GET /api/admin/reports?period=30   (7 | 30 | 90 | 365)
export async function getReports(req, res) {
  const days = [7, 30, 90, 365].includes(Number(req.query.period)) ? Number(req.query.period) : 30;
  const since = daysAgo(days - 1);

  const [
    totalUsers, newUsers, totalProjects, newProjects, totalAi, periodAi, aiFailed,
    usersDaily, projectsDaily, aiDaily, typeRows, topCreators, featureRows,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: since } }),
    Project.countDocuments(),
    Project.countDocuments({ createdAt: { $gte: since } }),
    AiUsage.countDocuments(),
    AiUsage.countDocuments({ createdAt: { $gte: since } }),
    AiUsage.countDocuments({ createdAt: { $gte: since }, success: false }),
    perDay(User, since, days),
    perDay(Project, since, days),
    perDay(AiUsage, since, days),
    Project.aggregate([{ $group: { _id: "$floorPlanData.source", count: { $sum: 1 } } }]),
    Project.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { _id: 0, name: "$user.name", email: "$user.email", count: 1 } },
    ]),
    AiUsage.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$feature", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  const projectTypes = {};
  typeRows.forEach((r) => {
    const label = projectType(r._id);
    projectTypes[label] = (projectTypes[label] || 0) + r.count;
  });

  res.json({
    success: true,
    data: {
      period: days,
      summary: {
        totalUsers, newUsers, totalProjects, newProjects, totalAiRequests: totalAi,
        periodAiRequests: periodAi,
        aiSuccessRate: periodAi ? Math.round(((periodAi - aiFailed) / periodAi) * 100) : 100,
      },
      charts: { users: usersDaily, projects: projectsDaily, aiRequests: aiDaily },
      projectTypes: Object.entries(projectTypes).map(([name, count]) => ({ name, count })),
      topCreators,
      aiFeatures: featureRows.map((r) => ({ name: r._id, count: r.count })),
    },
  });
}

// GET /api/admin/reports/export?type=users|projects|ai-usage
export async function exportReport(req, res) {
  const type = req.query.type;
  let rows;

  if (type === "users") {
    const users = await User.find().sort({ createdAt: -1 });
    rows = users.map((u) => ({ Name: u.name, Email: u.email, Role: u.role, Status: u.status, "Last Login": u.lastLoginAt || "", Joined: u.createdAt }));
  } else if (type === "projects") {
    const projects = await Project.find().sort({ createdAt: -1 }).populate("user", "name email").select("name user createdAt floorPlanData.source");
    rows = projects.map((p) => ({ Project: p.name, Owner: p.user?.name || "", Email: p.user?.email || "", Type: projectType(p.floorPlanData?.source), Created: p.createdAt }));
  } else if (type === "ai-usage") {
    const logs = await AiUsage.find().sort({ createdAt: -1 }).limit(10000);
    rows = logs.map((l) => ({ User: l.userName, Email: l.email, Feature: l.feature, Success: l.success, "Duration (ms)": l.durationMs, Date: l.createdAt }));
  } else {
    throw httpError(400, "type must be users, projects or ai-usage");
  }

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${type}-${dayKey(new Date())}.csv"`);
  res.send("\uFEFF" + toCsv(rows));
}
