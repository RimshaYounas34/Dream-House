import Setting from "../models/Setting.js";
import User from "../models/User.js";
import { httpError } from "../utils/adminHelpers.js";

const FIELDS = ["aiEnabled", "maintenanceMode", "registrationOpen", "notificationsEnabled"];

// GET /api/settings/public  (login nahi chahiye: frontend maintenance banner ke liye)
export async function getPublicSettings(req, res) {
  const s = await Setting.getGlobal();
  res.json({ success: true, data: { maintenanceMode: s.maintenanceMode, aiEnabled: s.aiEnabled, registrationOpen: s.registrationOpen } });
}

// GET /api/admin/settings
export async function getAdminSettings(req, res) {
  const s = await Setting.getGlobal();
  res.json({ success: true, data: Object.fromEntries(FIELDS.map((f) => [f, s[f]])) });
}

// PUT /api/admin/settings   { aiEnabled?, maintenanceMode?, registrationOpen?, notificationsEnabled? }
export async function updateAdminSettings(req, res) {
  const s = await Setting.getGlobal();
  FIELDS.forEach((field) => {
    if (typeof req.body?.[field] === "boolean") s[field] = req.body[field];
  });
  await s.save();
  res.json({ success: true, data: Object.fromEntries(FIELDS.map((f) => [f, s[f]])) });
}

// PUT /api/admin/profile   { name?, email? }
export async function updateAdminProfile(req, res) {
  const user = await User.findById(req.user._id);
  const { name, email } = req.body || {};

  if (name !== undefined) {
    if (!String(name).trim()) throw httpError(400, "Name cannot be empty");
    user.name = String(name).trim().slice(0, 120);
  }
  if (email !== undefined) {
    const normalized = String(email).trim().toLowerCase();
    if (await User.findOne({ email: normalized, _id: { $ne: user._id } })) throw httpError(409, "That email is already in use");
    user.email = normalized;
  }

  await user.save();
  res.json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
}

// PUT /api/admin/password   { currentPassword, newPassword }
export async function changeAdminPassword(req, res) {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) throw httpError(400, "Current and new password are required");
  if (newPassword.length < 8) throw httpError(400, "New password must be at least 8 characters");

  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(currentPassword))) throw httpError(401, "Current password is incorrect");

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: "Password updated" });
}
