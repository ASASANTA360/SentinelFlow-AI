import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "../../../lib/mongodb";
import AuditLog from "../../../models/AuditLog";
import Case from "../../../models/Case";
import CaseEvent from "../../../models/CaseEvent";

const riskLevels = ["low", "medium", "high", "critical"] as const;
const statuses = [
  "pending",
  "in_progress",
  "human_review",
  "escalated",
  "resolved",
  "rejected",
] as const;

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const status = searchParams.get("status")?.trim();
    const risk = searchParams.get("risk")?.trim();
    const filters: Record<string, unknown> = {};

    if (status) {
      if (!statuses.includes(status as (typeof statuses)[number])) {
        return errorResponse("Invalid status filter.", 400);
      }

      filters.status = status;
    }

    if (risk) {
      if (!riskLevels.includes(risk as (typeof riskLevels)[number])) {
        return errorResponse("Invalid risk filter.", 400);
      }

      filters.riskLevel = risk;
    }

    if (q) {
      const regex = escapeRegex(q);
      filters.$or = [
        { title: { $regex: regex, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$_id" },
              regex,
              options: "i",
            },
          },
        },
      ];
    }

    const cases = await Case.find(filters).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ cases });
  } catch (error) {
    if (isDatabaseConfigError(error)) {
      return errorResponse("Database connection is not configured.", 500);
    }

    return errorResponse("Failed to fetch cases.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json().catch(() => null);
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const description =
      typeof body?.description === "string" ? body.description.trim() : "";
    const riskLevel =
      typeof body?.riskLevel === "string" ? body.riskLevel.trim() : "low";
    const priority =
      typeof body?.priority === "string" ? body.priority.trim() : undefined;

    if (!title || !description) {
      return errorResponse("Title and description are required.", 400);
    }

    if (!riskLevels.includes(riskLevel as (typeof riskLevels)[number])) {
      return errorResponse("Invalid risk level.", 400);
    }

    const createdCase = await Case.create({
      title,
      description,
      riskLevel,
      priority,
    });

    await CaseEvent.create({
      caseId: createdCase._id,
      type: "created",
      message: "Case created",
      actor: "system",
      metadata: {
        status: createdCase.status,
        riskLevel: createdCase.riskLevel,
      },
    });

    await AuditLog.create({
      caseId: createdCase._id,
      action: "CASE_CREATED",
      actor: "system",
      details: {
        title: createdCase.title,
        riskLevel: createdCase.riskLevel,
      },
    });

    return NextResponse.json({ case: createdCase }, { status: 201 });
  } catch (error) {
    if (isDatabaseConfigError(error)) {
      return errorResponse("Database connection is not configured.", 500);
    }

    return errorResponse("Failed to create case.", 500);
  }
}
