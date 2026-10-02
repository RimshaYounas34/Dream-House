import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    size: { type: String, default: "", trim: true },          // e.g. "30 x 60 ft"
    style: { type: String, default: "", trim: true },         // e.g. "Pakistani Modern"
    rooms: { type: [String], default: [] },                   // card par dikhne wali list
    floorPlanData: { type: mongoose.Schema.Types.Mixed, default: {} },
    isPublished: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Template", templateSchema);
