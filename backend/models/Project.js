import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.Mixed, default: {} },
    rooms: { type: [mongoose.Schema.Types.Mixed], default: [] },
    doors: { type: [mongoose.Schema.Types.Mixed], default: [] },
    windows: { type: [mongoose.Schema.Types.Mixed], default: [] },
    walls: { type: [mongoose.Schema.Types.Mixed], default: [] },
    furniture: { type: [mongoose.Schema.Types.Mixed], default: [] },
    dimensions: { type: [mongoose.Schema.Types.Mixed], default: [] },
    layers: { type: mongoose.Schema.Types.Mixed, default: {} },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
    site: { type: mongoose.Schema.Types.Mixed, default: {} },
    exterior: { type: mongoose.Schema.Types.Mixed, default: {} },
    interior: { type: mongoose.Schema.Types.Mixed, default: {} },
    materials: { type: mongoose.Schema.Types.Mixed, default: {} },
    lighting: { type: mongoose.Schema.Types.Mixed, default: {} },
    roof: { type: mongoose.Schema.Types.Mixed, default: {} },
    floors: { type: [mongoose.Schema.Types.Mixed], default: [] },
    aiHistory: { type: [mongoose.Schema.Types.Mixed], default: [] },
    source: { type: String, default: "manual" },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 2000, default: "" },
    floorPlanData: { type: planSchema, default: () => ({}) },
    thumbnail: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
