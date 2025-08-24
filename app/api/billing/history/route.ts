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
    const items: any[] = json?.data ?? [];

    // Filter by customer email
    const email = (dbUser.email || "").toLowerCase();
    const mapped = items
      .map((it) => {
        const a = it?.attributes || {};
        return {
          id: it?.id,
          date: a?.created_at,
          description: a?.product_name || a?.identifier || "Order",
          amount: (a?.total || 0) / 100, // cents to dollars
          currency: a?.currency || "USD",
          status: a?.status || "paid",
          user_email: (a?.user_email || "").toLowerCase(),
        };
      })
      .filter((o) => !email || o.user_email === email)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ data: mapped });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
