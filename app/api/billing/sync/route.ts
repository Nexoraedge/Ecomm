import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-ssr";
import { supabaseServer } from "@/lib/supabase";
import { env } from "@/lib/env";

// Fallback: verify recent order for logged-in user and set plan=pro, credits=600
export async function POST() {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: dbUser, error: userErr } = await supabaseServer
      .from("users")
      .select("id, email")
      .eq("auth_user_id", auth.user.id)
      .single();
    if (userErr || !dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (!env.LEMONSQUEEZY_API_KEY || !env.LEMONSQUEEZY_STORE_ID) {
      // If Lemon API not configured, bail gracefully
      return NextResponse.json({ ok: false, reason: "Lemon API not configured" }, { status: 200 });
    }

    const myEmail = (dbUser.email || "").toLowerCase();
    const now = Date.now();

    // 1) Prefer subscriptions: consider on_trial or active as valid
    try {
      const subUrl = new URL("https://api.lemonsqueezy.com/v1/subscriptions");
      subUrl.searchParams.set("filter[store_id]", env.LEMONSQUEEZY_STORE_ID);
      subUrl.searchParams.set("page[size]", "50");
      const subRes = await fetch(subUrl.toString(), {
        headers: { Authorization: `Bearer ${env.LEMONSQUEEZY_API_KEY}`, Accept: "application/json" },
      });
      if (subRes.ok) {
        const sj = await subRes.json();
        const subs: unknown[] = Array.isArray(sj?.data) ? (sj.data as unknown[]) : [];
        const subMatch = subs.find((raw) => {
          const s = raw as { attributes?: Record<string, unknown> };
          const a = (s?.attributes ?? {}) as Record<string, unknown>;
          const email = typeof a.user_email === "string" ? a.user_email.toLowerCase() : "";
          const status = typeof a.status === "string" ? a.status.toLowerCase() : "";
          const createdAt = typeof a.created_at === "string" ? Date.parse(a.created_at) : 0;
          const isRecent = createdAt && now - createdAt < 24 * 60 * 60 * 1000;
          const okStatus = status === "on_trial" || status === "active";
          return email === myEmail && okStatus && isRecent;
        });
        if (subMatch) {
          await supabaseServer
            .from("users")
            .update({ subscription_plan: "pro", analyses_remaining: 600 })
            .eq("id", dbUser.id);
          return NextResponse.json({ ok: true, source: "subscription" });
        }
      }
    } catch {}

    // 2) Fallback to orders: look for paid order in last 24h
    try {
      const url = new URL("https://api.lemonsqueezy.com/v1/orders");
      url.searchParams.set("filter[store_id]", env.LEMONSQUEEZY_STORE_ID);
      url.searchParams.set("page[size]", "25");
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${env.LEMONSQUEEZY_API_KEY}`, Accept: "application/json" },
      });
      if (res.ok) {
        const json = await res.json();
        const items: unknown[] = Array.isArray(json?.data) ? (json.data as unknown[]) : [];
        const match = items.find((raw) => {
          const it = raw as { attributes?: Record<string, unknown> };
          const a = (it?.attributes ?? {}) as Record<string, unknown>;
          const email = typeof a.user_email === "string" ? a.user_email.toLowerCase() : "";
          const createdAt = typeof a.created_at === "string" ? Date.parse(a.created_at) : 0;
          const isRecent = createdAt && now - createdAt < 24 * 60 * 60 * 1000;
          const isPaid = (typeof a.status === "string" ? a.status : "").toLowerCase() === "paid";
          return email === myEmail && isRecent && isPaid;
        });
        if (match) {
          await supabaseServer
            .from("users")
            .update({ subscription_plan: "pro", analyses_remaining: 600 })
            .eq("id", dbUser.id);
          return NextResponse.json({ ok: true, source: "order" });
        }
      }
    } catch {}

    return NextResponse.json({ ok: false, reason: "No recent active/trial subscription or paid order found" }, { status: 200 });

    await supabaseServer
      .from("users")
      .update({ subscription_plan: "pro", analyses_remaining: 600 })
      .eq("id", dbUser?.id);

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
