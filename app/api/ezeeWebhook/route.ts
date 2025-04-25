import { db } from "@/drizzle/db";
import { ezeeWebhookData } from "@/drizzle/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();

    await db.insert(ezeeWebhookData).values({
      reqBody: reqBody,
      status: "PENDING",
    });

    return NextResponse.json(
      { message: "Data stored successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error storing webhook data:", error);
    return NextResponse.json(
      { error: "Failed to store data" },
      { status: 500 },
    );
  }
}
