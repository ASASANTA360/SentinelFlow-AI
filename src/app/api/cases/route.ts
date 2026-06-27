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

type PostOperationPhase =
  | "database_connect"
  | "case_create"
  | "event_create"
  | "audit_log_create";

const postFailureCodes: Record<PostOperationPhase, string> = {
  database_connect: "DATABASE_CONNECT_FAILED",
  case_create: "CASE_CREATE_FAILED",
  event_create: "EVENT_CREATE_FAILED",
  audit_log_create: "AUDIT_LOG_CREATE_FAILED",
};

function getErrorDetails(error: unknown) {
  const errorRecord =
    error && typeof error === "object" ? (error as Record<string, unknown>) : {};
  const code = errorRecord.code;

  return {
    name: error instanceof Error ? error.name : typeof error,
    message: error instanceof Error ? error.message : "Unknown error",
    ...(typeof code === "string" || typeof code === "number" ? { code } : {}),
  };
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
  let phase: PostOperationPhase = "database_connect";

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

    phase = "case_create";
    const createdCase = await Case.create({
      title,
      description,
      riskLevel,
      priority,
    });

    phase = "event_create";
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

    phase = "audit_log_create";
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
    console.error({
      phase,
      ...getErrorDetails(error),
    });

    return NextResponse.json(
      { error: "Failed to create case.", code: postFailureCodes[phase] },
      { status: 500 },
    );
  }
}
