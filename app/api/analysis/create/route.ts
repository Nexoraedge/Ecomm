import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase";
import { getSupabaseServerClient } from "@/lib/supabase-ssr";

const BodySchema = z.object({
  productName: z.string().min(2),
  productDescription: z.string().optional().default(""),
  productFeatures: z.string().optional(),
  category: z.string().optional(),
  targetPlatform: z.enum(["amazon", "flipkart", "meesho"]),
});

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseServerClient();
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const json = await req.json();
    const body = BodySchema.parse(json);

    // Resolve Supabase user_id
    const { data: dbUser, error: userErr } = await supabaseServer
      .from("users")
      .select("id, analyses_remaining, subscription_plan")
      .eq("auth_user_id", authData.user.id)
      .single();
    if (userErr || !dbUser) return NextResponse.json({ error: "User not found in DB" }, { status: 400 });

    // Simple usage limit check
    if ((dbUser.analyses_remaining ?? 0) <= 0) {
      return NextResponse.json({ error: "Analysis limit reached for current plan" }, { status: 402 });
    }

    const { data: insert, error } = await supabaseServer
      .from("product_analyses")
      .insert({
        user_id: dbUser.id,
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
      .update({ analyses_remaining: (dbUser.analyses_remaining ?? 0) - 1 })
      .eq("id", dbUser.id);

    return NextResponse.json({ id: insert.id, status: "pending" });
  } catch (e: any) {
    const msg = e?.message || "Failed to create analysis";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
