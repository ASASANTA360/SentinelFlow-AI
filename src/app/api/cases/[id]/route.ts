import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "../../../../lib/mongodb";
import AuditLog from "../../../../models/AuditLog";
import Case from "../../../../models/Case";
import CaseEvent from "../../../../models/CaseEvent";

const editableFields = [
  "status",
  "riskLevel",
  "score",
  "assignedAgent",
  "recommendation",
  "aiSummary",
] as const;

const riskLevels = ["low", "medium", "high", "critical"] as const;
const statuses = [
  "pending",
  "in_progress",
  "human_review",
  "escalated",
  "resolved",
  "rejected",
] as const;

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function isDatabaseConfigError(error: unknown) {
  return (
    error instanceof Error &&
    error.message === "Database connection is not configured."
  );
}

function isValidCaseId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!isValidCaseId(id)) {
      return errorResponse("Case not found.", 404);
    }

    const caseDocument = await Case.findById(id).lean();

    if (!caseDocument) {
      return errorResponse("Case not found.", 404);
    }

    const [events, auditLogs] = await Promise.all([
      CaseEvent.find({ caseId: id }).sort({ createdAt: -1 }).lean(),
      AuditLog.find({ caseId: id }).sort({ createdAt: -1 }).lean(),
    ]);

    return NextResponse.json({
      case: caseDocument,
      events,
      auditLogs,
    });
  } catch (error) {
    if (isDatabaseConfigError(error)) {
      return errorResponse("Database connection is not configured.", 500);
    }

    return errorResponse("Failed to fetch case.", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!isValidCaseId(id)) {
      return errorResponse("Case not found.", 404);
    }

    const body = await request.json().catch(() => null);
    const updates: Record<string, string | number> = {};

    for (const field of editableFields) {
      const value = body?.[field];

      if (value === undefined) {
        continue;
      }

      if (field === "score") {
        const numericScore = Number(value);

        if (!Number.isFinite(numericScore)) {
          return errorResponse("Score must be a number.", 400);
        }

        updates.score = numericScore;
        continue;
      }

      if (typeof value !== "string") {
        return errorResponse(`${field} must be a string.`, 400);
      }

      const trimmedValue = value.trim();

      if (field === "status") {
        if (!statuses.includes(trimmedValue as (typeof statuses)[number])) {
          return errorResponse("Invalid status.", 400);
        }
      }

      if (field === "riskLevel") {
        if (!riskLevels.includes(trimmedValue as (typeof riskLevels)[number])) {
          return errorResponse("Invalid risk level.", 400);
        }
      }

      updates[field] = trimmedValue;
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse("No permitted case updates were provided.", 400);
    }

    updates.lastUpdatedBy = "system";

    const updatedCase = await Case.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedCase) {
      return errorResponse("Case not found.", 404);
    }

    await CaseEvent.create({
      caseId: updatedCase._id,
      type: "updated",
      message: "Case updated",
      actor: "system",
      metadata: {
        updates,
      },
    });

    await AuditLog.create({
      caseId: updatedCase._id,
      action: "CASE_UPDATED",
      actor: "system",
      details: {
        updates,
      },
    });

    return NextResponse.json({ case: updatedCase });
  } catch (error) {
    if (isDatabaseConfigError(error)) {
      return errorResponse("Database connection is not configured.", 500);
    }

    return errorResponse("Failed to update case.", 500);
  }
}
