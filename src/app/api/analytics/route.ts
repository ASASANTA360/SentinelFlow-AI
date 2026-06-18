import { NextResponse } from "next/server";

import { connectDB } from "../../../lib/mongodb";

import Case from "../../../models/Case";

export async function GET() {

  await connectDB();

  const totalCases = await Case.countDocuments();

  const resolvedCases =
    await Case.countDocuments({
      status: "resolved",
    });

  const highRisk =
    await Case.countDocuments({
      riskLevel: "high",
    });

  return NextResponse.json({
    totalCases,
    resolvedCases,
    highRisk,
  });

}