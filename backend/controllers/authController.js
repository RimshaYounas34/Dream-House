import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Setting from "../models/Setting.js";

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

function tokenFor(user) {
  return jwt.sign({ sub: String(user._id), role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
}

export async function register(req, res) {
  const settings = await Setting.getGlobal();
  if (!settings.registrationOpen) return res.status(403).json({ success: false, message: "New registrations are currently closed" });

  const { name, email, password } = req.body || {};
  if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ success: false, message: "Name, email and password are required" });
  if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return res.status(409).json({ success: false, message: "An account with that email already exists" });

  // role HAMESHA "user" hota hai. Admin sirf scripts/createAdmin.js ya admin panel se banta hai.
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password, lastLoginAt: new Date() });
  res.status(201).json({ success: true, data: { user: publicUser(user), token: tokenFor(user) } });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email: String(email || "").trim().toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password || ""))) return res.status(401).json({ success: false, message: "Invalid email or password" });
  if (user.status === "inactive") return res.status(403).json({ success: false, message: "Your account has been deactivated. Contact the administrator." });

  user.lastLoginAt = new Date();
  await user.save({ validateModifiedOnly: true });

  res.json({ success: true, data: { user: publicUser(user), token: tokenFor(user) } });
}

export function me(req, res) {
  res.json({ success: true, data: { user: publicUser(req.user) } });
}
