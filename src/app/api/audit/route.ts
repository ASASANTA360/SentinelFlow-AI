import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import "../../../models/Case";
import AuditLog from "../../../models/AuditLog";

export async function GET() {
  try {
    await connectDB();

    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .populate("caseId", "caseId title")
      .lean();

    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch audit logs." },
      { status: 500 }
    );
  }
}
