import { NextResponse } from "next/server";

import { connectDB } from "../../../lib/mongodb";

import Timeline from "../../../models/Timeline";

export async function GET() {

  await connectDB();

  const timeline =
    await Timeline.find()
      .sort({
        createdAt: -1,
      });

  return NextResponse.json(
    timeline
  );

}