import mongoose from "mongoose";

const TimelineSchema = new mongoose.Schema(
  {
    caseId: String,

    agent: String,

    action: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Timeline ||
  mongoose.model("Timeline", TimelineSchema);