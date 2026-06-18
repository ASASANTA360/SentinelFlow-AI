import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    const NotificationModel = mongoose.models.Notification;
    if (!NotificationModel) {
      return NextResponse.json(
        { success: false, message: "Notification model not registered" },
        { status: 500 }
      );
    }

    const notifications = await NotificationModel.find().sort({ createdAt: -1 });

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}