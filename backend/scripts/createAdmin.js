// Pehla admin banane ke liye (ya kisi maujooda user ko admin banane ke liye):
//
//   npm run create-admin -- "Admin Name" admin@example.com StrongPassword123
//
import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

const [name = "Administrator", email, password] = process.argv.slice(2);

if (!email || !password) {
  console.error('Usage: npm run create-admin -- "Admin Name" admin@example.com StrongPassword123');
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password must be at least 8 characters");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const normalized = email.trim().toLowerCase();
const existing = await User.findOne({ email: normalized }).select("+password");

if (existing) {
  existing.role = "admin";
  existing.status = "active";
  existing.password = password; // dobara hash ho jayega
  await existing.save();
  console.log(`Existing user promoted to admin: ${normalized}`);
} else {
  await User.create({ name, email: normalized, password, role: "admin" });
  console.log(`Admin created: ${normalized}`);
}

await mongoose.disconnect();
