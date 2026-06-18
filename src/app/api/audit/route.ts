import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import AuditLog from "../../../models/AuditLog";

export async function GET() {
  try {
    await connectDB();

    const logs = await AuditLog.find().sort({ createdAt: -1 });

    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}