import { NextResponse } from "next/server";

import { connectDB } from "../../../lib/mongodb";

import Case from "../../../models/Case";

const statuses = [
  "pending",
  "in_progress",
  "human_review",
  "escalated",
  "resolved",
  "rejected",
] as const;

const riskLevels = ["low", "medium", "high", "critical"] as const;

type GroupCount = {
  _id: string | null;
  count: number;
};

function emptyCounts(keys: readonly string[]): Record<string, number> {
  return keys.reduce(
    (counts, key) => ({
      ...counts,
      [key]: 0,
    }),
    {} as Record<string, number>,
  );
}

function normalizeCounts(
  keys: readonly string[],
  groups: GroupCount[],
) {
  const counts = emptyCounts(keys);

  for (const group of groups) {
    const key = group._id || "unknown";
    counts[key] = group.count;
  }

  return counts;
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function isDatabaseConfigError(error: unknown) {
  return (
    error instanceof Error &&
    error.message === "Database connection is not configured."
  );
}

export async function GET() {
  try {
    await connectDB();

    const [
      totalCases,
      activeCases,
      highRiskCases,
      resolvedCases,
      humanReviewCases,
      statusGroups,
      riskLevelGroups,
    ] = await Promise.all([
      Case.countDocuments(),
      Case.countDocuments({ status: { $nin: ["resolved", "rejected"] } }),
      Case.countDocuments({ riskLevel: { $in: ["high", "critical"] } }),
      Case.countDocuments({ status: "resolved" }),
      Case.countDocuments({ status: "human_review" }),
      Case.aggregate<GroupCount>([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Case.aggregate<GroupCount>([
        {
          $group: {
            _id: "$riskLevel",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const resolutionRate =
      totalCases === 0 ? 0 : Math.round((resolvedCases / totalCases) * 100);

    return NextResponse.json({
      totalCases,
      activeCases,
      highRiskCases,
      resolvedCases,
      humanReviewCases,
      resolutionRate,
      byStatus: normalizeCounts(statuses, statusGroups),
      byRiskLevel: normalizeCounts(riskLevels, riskLevelGroups),
    });
  } catch (error) {
    if (isDatabaseConfigError(error)) {
      return errorResponse("Database connection is not configured.", 500);
    }

    return errorResponse("Failed to fetch analytics.", 500);
  }
}
