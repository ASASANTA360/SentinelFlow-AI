import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema(
  {
    caseId: String,

    action: String,

    performedBy: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AuditLog ||
  mongoose.model("AuditLog", AuditSchema);