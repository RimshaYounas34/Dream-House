import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "./models/User.js";

const ADMIN_EMAIL = "admin@dreamhouse.com";
const ADMIN_PASSWORD = "StrongPass123";
const ADMIN_NAME = "DreamHouse Admin";

async function createAdmin() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not configured");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");
    console.log("Database:", mongoose.connection.name);

    const email = ADMIN_EMAIL.toLowerCase().trim();

    let user = await User.findOne({ email }).select("+password");

    if (user) {
      console.log("Admin email already exists.");

      user.name = ADMIN_NAME;
      user.password = ADMIN_PASSWORD;
      user.role = "admin";
      user.status = "active";
      user.authProvider = "email";
      user.lastLoginAt = new Date();

      await user.save();

      console.log("Existing account converted to admin.");
    } else {
      user = await User.create({
        name: ADMIN_NAME,
        email,
        password: ADMIN_PASSWORD,
        role: "admin",
        status: "active",
        authProvider: "email",
        lastLoginAt: new Date(),
      });

      console.log("New admin account created.");
    }

    console.log("");
    console.log("=================================");
    console.log("ADMIN ACCOUNT READY");
    console.log("=================================");
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("Status:", user.status);
    console.log("=================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("Failed to create admin:");
    console.error(error.message);

    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();