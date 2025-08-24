import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { getSupabaseServerClient } from "@/lib/supabase-ssr";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;
    // Ensure analysis belongs to current user
    const { data, error } = await supabaseServer
      .from("product_analyses")
      .select("id, status, created_at, completed_at, user_id")
      .eq("id", id)
      .single();

    if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { data: dbUser } = await supabaseServer
      .from("users")
      .select("id")
      .eq("auth_user_id", authData.user.id)
      .single();

    if (!dbUser || dbUser.id !== data.user_id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json({ id: data.id, status: data.status, createdAt: data.created_at, completedAt: data.completed_at });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unexpected error" }, { status: 500 });
  }
}
