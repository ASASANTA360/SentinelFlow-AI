import mongoose from "mongoose";

const CaseSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

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
        "escalated",
        "resolved",
        "rejected",
      ],
      default: "pending",
    },

    score: {
      type: Number,
      default: 0,
    },

    assignedAgent: {
      type: String,
      default: "Case Brain Agent",
    },

    aiSummary: String,

    recommendation: String,

    findings: [String],

    priority: String,

    lastUpdatedBy: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Case ||
  mongoose.model("Case", CaseSchema);
