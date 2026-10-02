import mongoose from "mongoose";

const projectVersionSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    versionNumber: { type: Number, required: true },
    floorPlanData: { type: mongoose.Schema.Types.Mixed, required: true },
    description: { type: String, trim: true, maxlength: 500, default: "Plan update" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

projectVersionSchema.index({ project: 1, versionNumber: 1 }, { unique: true });

export default mongoose.model("ProjectVersion", projectVersionSchema);
