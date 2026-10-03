import mongoose from "mongoose";

export const AI_FEATURES = {
  FLOOR_PLAN_GENERATOR: "AI Floor Plan Generator",
  AI_EDIT_COMMANDS: "AI Edit Commands",
  ADD_ROOM: "Add Room Commands",
  MOVE_ROOM: "Move Room Commands",
  DELETE_ROOM: "Delete Room Commands",
  THREE_D_GENERATION: "3D Generation",
};

const aiUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    userName: {
      type: String,
      default: "Registered User",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    feature: {
      type: String,
      required: true,
      trim: true,
    },

    action: {
      type: String,
      default: "",
      trim: true,
    },

    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const AiUsage =
  mongoose.models.AiUsage ||
  mongoose.model("AiUsage", aiUsageSchema);

export default AiUsage;