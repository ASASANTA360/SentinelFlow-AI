import mongoose from "mongoose";

const CaseEventSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    actor: {
      type: String,
      required: true,
      default: "system",
      trim: true,
    },

    metadata: mongoose.Schema.Types.Mixed,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.models.CaseEvent ||
  mongoose.model("CaseEvent", CaseEventSchema);
