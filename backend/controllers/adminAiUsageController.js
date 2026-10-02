import AiUsage, { AI_FEATURES } from "../models/AiUsage.js";
import { daysAgo, dayKey, parsePaging } from "../utils/adminHelpers.js";

// GET /api/admin/ai-usage?days=7
export async function getAiUsage(req, res) {
  const days = Math.min(Math.max(Number(req.query.days) || 7, 1), 90);
  const since = daysAgo(days - 1);

  const [total, plans, commands, userIds, featureRows, dailyRows, topUsers, recent, failed] = await Promise.all([
    AiUsage.countDocuments(),
    AiUsage.countDocuments({ feature: "AI Floor Plan Generator" }),
    AiUsage.countDocuments({ feature: { $in: ["AI Edit Commands", "Add Room Commands", "Move Room Commands", "Delete Room Commands"] } }),
    AiUsage.distinct("email", { email: { $ne: "" } }),
    AiUsage.aggregate([{ $group: { _id: "$feature", count: { $sum: 1 } } }]),
    AiUsage.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    ]),
    AiUsage.aggregate([
      { $match: { email: { $ne: "" } } },
      { $group: { _id: "$email", name: { $last: "$userName" }, count: { $sum: 1 }, lastUsed: { $max: "$createdAt" } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    AiUsage.find().sort({ createdAt: -1 }).limit(20).select("userName email feature action prompt success durationMs createdAt"),
    AiUsage.countDocuments({ success: false }),
  ]);

  const featureMap = Object.fromEntries(featureRows.map((r) => [r._id, r.count]));
  const dailyMap = Object.fromEntries(dailyRows.map((r) => [r._id, r.count]));

  const dailyUsage = Array.from({ length: days }, (_, i) => {
    const date = daysAgo(days - 1 - i);
    const key = dayKey(date);
    return { date: key, label: date.toLocaleDateString("en-US", { weekday: "short" }), count: dailyMap[key] || 0 };
  });

  res.json({
    success: true,
    data: {
      stats: { total, plans, commands, users: userIds.length, failed },
      featureStats: AI_FEATURES.map((name) => ({ name, count: featureMap[name] || 0 })),
      dailyUsage,
      activeUsers: topUsers.map((u) => ({ email: u._id, name: u.name, count: u.count, lastUsed: u.lastUsed })),
      recent,
    },
  });
}

// GET /api/admin/ai-usage/logs?feature=&success=&page=&limit=
export async function listAiLogs(req, res) {
  const { feature, success } = req.query;
  const { page, limit, skip } = parsePaging(req.query, 50, 200);

  const filter = {};
  if (feature) filter.feature = feature;
  if (success === "true" || success === "false") filter.success = success === "true";

  const [logs, total] = await Promise.all([
    AiUsage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    AiUsage.countDocuments(filter),
  ]);

  res.json({ success: true, data: logs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

// DELETE /api/admin/ai-usage   (saare logs saaf)
export async function clearAiLogs(req, res) {
  const result = await AiUsage.deleteMany({});
  res.json({ success: true, data: { deleted: result.deletedCount } });
}
