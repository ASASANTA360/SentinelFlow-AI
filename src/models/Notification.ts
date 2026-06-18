import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    message: String,

    severity: {
      type: String,
      enum: ["info", "warning", "critical"],
      default: "info",
    },

    status: {
      type: String,
      default: "unread",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Notification ||
  mongoose.model(
    "Notification",
    NotificationSchema
  );