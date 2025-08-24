import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { getSupabaseServerClient } from "@/lib/supabase-ssr";

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch or create user record in Supabase
    const { data, error } = await supabaseServer
      .from("users")
      .select("*")
      .eq("auth_user_id", authData.user.id)
      .maybeSingle();

    if (error) throw error;

    // Auto-provision profile if missing
    let profile = data;
    if (!profile) {
      const email = authData.user.email ?? null;
      const full_name = authData.user.user_metadata?.full_name ?? null;
      const up = await supabaseServer
        .from("users")
        .insert({ auth_user_id: authData.user.id, email, full_name })
        .select("*")
        .single();
      if (up.error) throw up.error;
      profile = up.data;
    }

    return NextResponse.json({
      auth: {
        id: authData.user.id,
        email: authData.user.email ?? null,
        name: (authData.user.user_metadata?.full_name as string | undefined) ?? null,
      },
      profile,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unexpected error" }, { status: 500 });
  }
}
