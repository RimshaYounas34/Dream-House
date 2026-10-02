import User from "../models/User.js";
import Project from "../models/Project.js";
import ProjectVersion from "../models/ProjectVersion.js";
import { escapeRegex, httpError, initials, parsePaging, projectType, tempPassword } from "../utils/adminHelpers.js";

const cap = (value = "") => value.charAt(0).toUpperCase() + value.slice(1);

// Users.jsx jo shape expect karta hai (Role: "Admin"/"User", Status: "Active"/"Inactive")
function serialize(user, projects = 0) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: cap(user.role),
    status: cap(user.status || "active"),
    avatar: initials(user.name),
    projects,
    lastLogin: user.lastLoginAt || null,
    joined: user.createdAt,
  };
}

async function projectCounts(userIds) {
  const rows = await Project.aggregate([
    { $match: { user: { $in: userIds } } },
    { $group: { _id: "$user", count: { $sum: 1 } } },
  ]);
  return Object.fromEntries(rows.map((r) => [String(r._id), r.count]));
}

const normRole = (value) => (String(value).toLowerCase() === "admin" ? "admin" : "user");
const normStatus = (value) => (String(value).toLowerCase() === "inactive" ? "inactive" : "active");

async function assertNotLastAdmin(user) {
  if (user.role !== "admin") return;
  const admins = await User.countDocuments({ role: "admin", status: { $ne: "inactive" } });
  if (admins <= 1) throw httpError(400, "At least one active administrator must remain");
}

// GET /api/admin/users?search=&role=&status=&page=&limit=
export async function listUsers(req, res) {
  const { search, role, status } = req.query;
  const { page, limit, skip } = parsePaging(req.query, 100, 500);

  const filter = {};
  if (search) {
    const rx = new RegExp(escapeRegex(String(search).trim()), "i");
    filter.$or = [{ name: rx }, { email: rx }];
  }
  if (role && role !== "All") filter.role = normRole(role);
  if (status && status !== "All") filter.status = normStatus(status) === "inactive" ? "inactive" : { $ne: "inactive" };

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [users, total, activeCount, adminCount, newThisWeek] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
    User.countDocuments({ status: { $ne: "inactive" } }),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ createdAt: { $gte: weekAgo } }),
  ]);

  const counts = await projectCounts(users.map((u) => u._id));

  res.json({
    success: true,
    data: users.map((u) => serialize(u, counts[String(u._id)] || 0)),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    stats: { total: await User.countDocuments(), active: activeCount, admins: adminCount, newThisWeek },
  });
}

// GET /api/admin/users/:id
export async function getUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) throw httpError(404, "User not found");

  const projects = await Project.find({ user: user._id }).sort({ updatedAt: -1 }).limit(10).select("name createdAt updatedAt floorPlanData.source");
  const total = await Project.countDocuments({ user: user._id });

  res.json({
    success: true,
    data: {
      ...serialize(user, total),
      recentProjects: projects.map((p) => ({ id: p._id, name: p.name, type: projectType(p.floorPlanData?.source), updatedAt: p.updatedAt })),
    },
  });
}

// POST /api/admin/users   { name, email, role?, password? }
export async function createUser(req, res) {
  const { name, email, role, password } = req.body || {};
  if (!name?.trim() || !email?.trim()) throw httpError(400, "Name and email are required");

  const normalizedEmail = email.trim().toLowerCase();
  if (await User.findOne({ email: normalizedEmail })) throw httpError(409, "An account with that email already exists");

  // Password na diya ho to khud bana kar ek baar wapas bhej dete hain
  const plainPassword = password || tempPassword();
  if (plainPassword.length < 8) throw httpError(400, "Password must be at least 8 characters");

  const user = await User.create({ name: name.trim(), email: normalizedEmail, password: plainPassword, role: normRole(role) });
  res.status(201).json({
    success: true,
    data: serialize(user, 0),
    ...(password ? {} : { temporaryPassword: plainPassword }),
  });
}

// PUT /api/admin/users/:id   { name?, email?, role?, status? }
export async function updateUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) throw httpError(404, "User not found");

  const isSelf = String(user._id) === String(req.user._id);
  const { name, email, role, status } = req.body || {};

  if (name !== undefined) {
    if (!String(name).trim()) throw httpError(400, "Name cannot be empty");
    user.name = String(name).trim().slice(0, 120);
  }

  if (email !== undefined) {
    const normalized = String(email).trim().toLowerCase();
    const clash = await User.findOne({ email: normalized, _id: { $ne: user._id } });
    if (clash) throw httpError(409, "That email is already used by another account");
    user.email = normalized;
  }

  if (role !== undefined && normRole(role) !== user.role) {
    if (isSelf) throw httpError(400, "You cannot change your own role");
    await assertNotLastAdmin(user);
    user.role = normRole(role);
  }

  if (status !== undefined && normStatus(status) !== user.status) {
    if (isSelf) throw httpError(400, "You cannot deactivate your own account");
    if (normStatus(status) === "inactive") await assertNotLastAdmin(user);
    user.status = normStatus(status);
  }

  await user.save();
  res.json({ success: true, data: serialize(user, await Project.countDocuments({ user: user._id })) });
}

// PATCH /api/admin/users/:id/status   { status? }  (na bhejo to toggle ho jata hai)
export async function toggleUserStatus(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) throw httpError(404, "User not found");
  if (String(user._id) === String(req.user._id)) throw httpError(400, "You cannot deactivate your own account");

  const next = req.body?.status ? normStatus(req.body.status) : user.status === "inactive" ? "active" : "inactive";
  if (next === "inactive") await assertNotLastAdmin(user);

  user.status = next;
  await user.save();
  res.json({ success: true, data: serialize(user, await Project.countDocuments({ user: user._id })) });
}

// PATCH /api/admin/users/:id/role   { role }
export async function changeUserRole(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) throw httpError(404, "User not found");
  if (String(user._id) === String(req.user._id)) throw httpError(400, "You cannot change your own role");

  const next = normRole(req.body?.role);
  if (next !== "admin") await assertNotLastAdmin(user);

  user.role = next;
  await user.save();
  res.json({ success: true, data: serialize(user, await Project.countDocuments({ user: user._id })) });
}

// POST /api/admin/users/:id/reset-password   { password? }
export async function resetUserPassword(req, res) {
  const user = await User.findById(req.params.id).select("+password");
  if (!user) throw httpError(404, "User not found");

  const plainPassword = req.body?.password || tempPassword();
  if (plainPassword.length < 8) throw httpError(400, "Password must be at least 8 characters");

  user.password = plainPassword;
  await user.save();
  res.json({ success: true, message: "Password reset", ...(req.body?.password ? {} : { temporaryPassword: plainPassword }) });
}

// DELETE /api/admin/users/:id   (user ke projects + versions bhi delete hote hain)
export async function deleteUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) throw httpError(404, "User not found");
  if (String(user._id) === String(req.user._id)) throw httpError(400, "You cannot delete your own account");
  await assertNotLastAdmin(user);

  const projects = await Project.find({ user: user._id }).select("_id");
  const ids = projects.map((p) => p._id);
  await ProjectVersion.deleteMany({ project: { $in: ids } });
  await Project.deleteMany({ user: user._id });
  await user.deleteOne();

  res.json({ success: true, data: { id: req.params.id, deletedProjects: ids.length } });
}
