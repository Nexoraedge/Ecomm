import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-ssr";
import { supabaseServer } from "@/lib/supabase";
import { env } from "@/lib/env";

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Resolve DB user
    const { data: dbUser, error: userErr } = await supabaseServer
      .from("users")
      .select("id, email")
      .eq("auth_user_id", authData.user.id)
      .single();
    if (userErr || !dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (!env.LEMONSQUEEZY_API_KEY || !env.LEMONSQUEEZY_STORE_ID) {
      return NextResponse.json({ data: [] }); // gracefully empty
    }

    const url = new URL("https://api.lemonsqueezy.com/v1/orders");
    url.searchParams.set("filter[store_id]", env.LEMONSQUEEZY_STORE_ID);
    url.searchParams.set("page[size]", "25");
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${env.LEMONSQUEEZY_API_KEY}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      const t = await res.text();
      return NextResponse.json({ error: `Lemon orders error: ${t}` }, { status: 500 });
    }
    const json = await res.json();
    const items: unknown[] = Array.isArray(json?.data) ? (json.data as unknown[]) : [];

    // Filter by customer email
    const email = (dbUser.email || "").toLowerCase();
    const mapped = items
      .map((raw) => {
        const it = raw as { id?: string; attributes?: Record<string, unknown> };
        const a = (it?.attributes ?? {}) as Record<string, unknown>;
        const created_at = typeof a.created_at === "string" ? a.created_at : "";
        const product_name = typeof a.product_name === "string" ? a.product_name : undefined;
        const identifier = typeof a.identifier === "string" ? a.identifier : undefined;
        const total = typeof a.total === "number" ? a.total : 0;
        const currency = typeof a.currency === "string" ? a.currency : "USD";
        const status = typeof a.status === "string" ? a.status : "paid";
        const user_email_raw = typeof a.user_email === "string" ? a.user_email : "";
        return {
          id: it?.id,
          date: created_at,
          description: product_name || identifier || "Order",
          amount: total / 100,
          currency,
          status,
          user_email: user_email_raw.toLowerCase(),
        };
      })
      .filter((o) => !email || o.user_email === email)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ data: mapped });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
