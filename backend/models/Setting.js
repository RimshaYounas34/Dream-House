import mongoose from "mongoose";

// Poori website ke liye sirf EK document (key: "global")
const settingSchema = new mongoose.Schema(
  {
    key: { type: String, default: "global", unique: true },
    aiEnabled: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    registrationOpen: { type: Boolean, default: true },
    notificationsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

settingSchema.statics.getGlobal = async function getGlobal() {
  let doc = await this.findOne({ key: "global" });
  if (!doc) {
    try {
      doc = await this.create({ key: "global" });
    } catch {
      doc = await this.findOne({ key: "global" }); // do requests ek saath aayi thin
    }
  }
  return doc;
};

export default mongoose.model("Setting", settingSchema);
