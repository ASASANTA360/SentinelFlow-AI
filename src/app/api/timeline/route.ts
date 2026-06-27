import { NextResponse } from "next/server";

import { connectDB } from "../../../lib/mongodb";

import "../../../models/Case";
import CaseEvent from "../../../models/CaseEvent";

export async function GET() {
  try {
    await connectDB();

    const events = await CaseEvent.find()
      .sort({ createdAt: -1 })
      .populate("caseId", "caseId title")
      .lean();

    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch timeline events." },
      { status: 500 },
    );
  }
}
