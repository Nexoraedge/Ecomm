import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { getSupabaseServerClient } from "@/lib/supabase-ssr";

export async function GET(req: Request) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") ?? 20);
    const offset = Number(searchParams.get("offset") ?? 0);

    const { data: dbUser } = await supabaseServer
      .from("users")
      .select("id")
      .eq("auth_user_id", authData.user.id)
      .single();
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { data, error, count } = await supabaseServer
      .from("product_analyses")
      .select("id, product_name, target_platform, status, created_at, completed_at", { count: "exact" })
      .eq("user_id", dbUser.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({ items: data ?? [], total: count ?? 0, limit, offset });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
