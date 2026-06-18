import { NextResponse } from "next/server";

import { caseBrainAgent } from "../../../agents/caseBrainAgent";

import { connectDB } from "../../../lib/mongodb";

import Case from "../../../models/Case";

import Timeline from "../../../models/Timeline";

import AuditLog from "../../../models/AuditLog";

import Notification from "../../../models/Notification";

export async function POST(req: Request) {
  try {

    await connectDB();

    const body = await req.json();

    const result = await caseBrainAgent(body);

    // Save Case
    const savedCase = await Case.create({
      title: body.invoiceId,
      description: body.customer,
      riskLevel: result.risk.riskLevel,
      status: result.resolution.status,
      score: result.risk.score,
      assignedAgent: "Case Brain Agent",
    });

    // Timeline
    await Timeline.create({
      caseId: savedCase._id,
      agent: "Case Brain Agent",
      action: "Case created",
    });

    // Audit
    await AuditLog.create({
      caseId: savedCase._id,
      action: "Risk generated",
      performedBy: "Risk Agent",
    });

    // Notification
    await Notification.create({
      message: `Case ${body.invoiceId} processed`,
      severity: "info",
      status: "unread",
    });

    return NextResponse.json({
      success: true,
      result,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );

  }
}