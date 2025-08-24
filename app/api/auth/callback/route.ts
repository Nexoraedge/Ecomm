import { NextResponse } from "next/server";

// Deprecated: Clerk webhook is no longer used after migration to Supabase Auth
export async function POST() {
  return NextResponse.json({ error: "Deprecated endpoint" }, { status: 410 });
}

export async function GET() {
  return NextResponse.json({ error: "Deprecated endpoint" }, { status: 410 });
}
