import mongoose from "mongoose";

const CaseSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    riskLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "in_progress",
        "human_review",
        "resolved",
      ],
      default: "pending",
    },

    score: Number,

    assignedAgent: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Case ||
  mongoose.model("Case", CaseSchema);