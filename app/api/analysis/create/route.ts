import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase";
import { getSupabaseServerClient } from "@/lib/supabase-ssr";
import { AnalysisWorkflow } from "@/services/analysisWorkflow";

const BodySchema = z.object({
  productName: z.string().min(2),
  productDescription: z.string().optional().default(""),
  productFeatures: z.string().optional(),
  category: z.string().optional(),
  targetPlatform: z.enum(["amazon", "flipkart", "meesho"]),
});

export async function POST(req: Request) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const json = await req.json();
    const body = BodySchema.parse(json);

    // Resolve Supabase user_id (auto-provision if missing)
    let dbUser: { id: string; analyses_remaining: number | null; subscription_plan: string | null } | null = null;
    {
      const { data, error: userErr } = await supabaseServer
        .from("users")
        .select("id, analyses_remaining, subscription_plan")
        .eq("auth_user_id", authData.user.id)
        .maybeSingle();

      if (userErr) throw userErr;
      dbUser = (data as { id: string; analyses_remaining: number | null; subscription_plan: string | null } | null);
    }

    if (!dbUser) {
      const email = authData.user.email ?? null;
      const full_name = (authData.user.user_metadata?.full_name as string | undefined) ?? null;
      const up = await supabaseServer
        .from("users")
        .insert({ auth_user_id: authData.user.id, email, full_name })
        .select("id, analyses_remaining, subscription_plan")
        .single();
      if (up.error) throw up.error;
      dbUser = up.data as { id: string; analyses_remaining: number | null; subscription_plan: string | null };
    }

    if (!dbUser) {
      throw new Error("User provisioning failed");
    }
    const user = dbUser;

    // Simple usage limit check
    if ((user.analyses_remaining ?? 0) <= 0) {
      return NextResponse.json({ error: "Analysis limit reached for current plan" }, { status: 402 });
    }

    const { data: insert, error } = await supabaseServer
      .from("product_analyses")
      .insert({
        user_id: user.id,
        product_name: body.productName,
        product_description: body.productDescription ?? null,
        product_features: body.productFeatures ?? null,
        category: body.category ?? null,
        target_platform: body.targetPlatform,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) throw error;

    // optionally decrement remaining
    await supabaseServer
      .from("users")
      .update({ analyses_remaining: (user.analyses_remaining ?? 0) - 1 })
      .eq("id", user.id);

    // Kick off background processing (fire-and-forget)
    try {
      const workflow = new AnalysisWorkflow();
      // Do not await; let it run in the background
      workflow.processAnalysis(insert.id).catch(() => {});
    } catch {}

    return NextResponse.json({ id: insert.id, status: "pending" });
  } catch (e: unknown) {
    console.error("/api/analysis/create error:", e);
    const msg = e instanceof Error ? e.message : "Failed to create analysis";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
