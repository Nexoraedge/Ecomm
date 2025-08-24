import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { getSupabaseServerClient } from "@/lib/supabase-ssr";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseServerClient();
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Resolve current user's id
    const { data: dbUser, error: userErr } = await supabaseServer
      .from("users")
      .select("id")
      .eq("auth_user_id", authData.user.id)
      .single();
    if (userErr || !dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Fetch analysis and verify ownership
    const { data: analysis, error } = await supabaseServer
      .from("product_analyses")
      .select("*")
      .eq("id", params.id)
      .single();
    if (error || !analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (analysis.user_id !== dbUser.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Load generated content and competitor data
    const [{ data: content }, { data: competitors }] = await Promise.all([
      supabaseServer
        .from("generated_content")
        .select("*")
        .eq("analysis_id", params.id)
        .order("created_at", { ascending: false })
        .limit(1),
      supabaseServer
        .from("competitor_data")
        .select("*")
        .eq("analysis_id", params.id)
        .order("scraped_at", { ascending: false }),
    ]);

    return NextResponse.json({ analysis, content: content?.[0] ?? null, competitors: competitors ?? [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unexpected error" }, { status: 500 });
  }
}
