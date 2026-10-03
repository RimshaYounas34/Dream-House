import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";

try {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("Connected database:", mongoose.connection.name);

  const users = await User.find().select("-password");

  console.log("Users found:", users.length);
  console.log(users);

  await mongoose.disconnect();
} catch (error) {
  console.error("DB CHECK ERROR:", error);
  process.exit(1);
}