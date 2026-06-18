import { NextResponse } from "next/server";

import { connectDB } from "../../../lib/mongodb";

import Case from "../../../models/Case";

export async function GET() {

  await connectDB();

  const cases = await Case.find()
    .sort({
      createdAt: -1,
    });

  return NextResponse.json(cases);

}