import { NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/lib/env";
import { supabaseServer } from "@/lib/supabase";

export const runtime = "nodejs";

function verifySignature(rawBody: string, signatureHeader?: string) {
  if (!env.LEMONSQUEEZY_WEBHOOK_SECRET) return false;
  if (!signatureHeader) return false;
  const hmac = crypto.createHmac("sha256", env.LEMONSQUEEZY_WEBHOOK_SECRET);
  const digest = hmac.update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signatureHeader));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("X-Signature") || req.headers.get("x-signature") || undefined;
  if (!verifySignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Extract user id from custom metadata
  const metaCustom = payload?.meta?.custom || payload?.data?.attributes?.checkout_data?.custom || {};
  const userId: string | undefined = metaCustom.user_id;
  const event = payload?.meta?.event_name || payload?.event || "";

  if (!userId) {
    return NextResponse.json({ error: "Missing user mapping" }, { status: 400 });
  }

  // Map event to plan updates
  let subscription_plan: string | null = null;
  let analyses_remaining: number | null = null;

  if (/subscription_(created|updated|resumed|unpaused)/.test(event) || /order_created/.test(event)) {
    subscription_plan = "pro";
    analyses_remaining = 600; // set Pro plan monthly credits
  }
  if (/subscription_(paused|cancelled|expired)/.test(event)) {
    subscription_plan = "free";
    analyses_remaining = 5;
  }

  if (subscription_plan) {
    await supabaseServer
      .from("users")
      .update({ subscription_plan, analyses_remaining })
      .eq("id", userId);
  }

  return NextResponse.json({ ok: true });
}
