import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { getSupabaseServerClient } from "@/lib/supabase-ssr";
import { z } from "zod";

const reportBugSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  category: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  screenshotUrl: z.string().url().optional(),
  browserInfo: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const json = await req.json();
    const body = reportBugSchema.parse(json);

    // Resolve Supabase user id
    const { data: dbUser, error: userErr } = await supabaseServer
      .from("users")
      .select("id")
      .eq("auth_user_id", authData.user.id)
      .single();
    if (userErr || !dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { error } = await supabaseServer.from("bug_reports").insert({
      user_id: dbUser.id,
      title: body.title,
      description: body.description,
      category: body.category ?? null,
      priority: body.priority ?? "medium",
      user_email: authData.user.email ?? null,
      screenshot_url: body.screenshotUrl ?? null,
      browser_info: body.browserInfo ?? null,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unexpected error" }, { status: 500 });
  }
}
