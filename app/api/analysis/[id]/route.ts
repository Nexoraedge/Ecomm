import { NextResponse } from "next/server";
import { KeywordsService } from "@/services/keywords";
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
      .eq("id", id)
      .single();
    if (error || !analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (analysis.user_id !== dbUser.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Load generated content and competitor data
    const [{ data: content }, { data: competitors }] = await Promise.all([
      supabaseServer
        .from("generated_content")
        .select("*")
        .eq("analysis_id", id)
        .order("created_at", { ascending: false })
        .limit(1),
      supabaseServer
        .from("competitor_data")
        .select("*")
        .eq("analysis_id", id)
        .order("scraped_at", { ascending: false }),
    ]);

    const contentRow: any = content?.[0] ?? null;
    const compRows: any[] = competitors ?? [];

    // Compute aggregate keyword stats from competitors
    const allCompKeywords: string[] = compRows.flatMap((c: any) => Array.isArray(c.extracted_keywords) ? c.extracted_keywords : []);
    const tagMap = new Map<string, number>();
    for (const k of allCompKeywords) {
      const key = String(k).toLowerCase();
      tagMap.set(key, (tagMap.get(key) ?? 0) + 1);
    }
    const topTags = Array.from(tagMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([tag, count]) => ({ tag, count }));

    // Keyword density: % of recommended keywords present in optimized description
    const recommended: string[] = Array.isArray(contentRow?.recommended_keywords) ? contentRow.recommended_keywords : [];
    const desc: string = String(contentRow?.optimized_description || "").toLowerCase();
    const present = recommended.filter((kw) => desc.includes(String(kw).toLowerCase()));
    const keywordDensityPercent = recommended.length ? Math.round((present.length / recommended.length) * 100) : 0;

    // Title improvement heuristic: overlap increase vs original product name words
    const origWords = String(analysis.product_name || "").toLowerCase().split(/\W+/).filter(Boolean);
    const optTitle = String(contentRow?.optimized_title || "").toLowerCase();
    const overlap = recommended.filter((kw) => optTitle.includes(String(kw).toLowerCase())).length;
    const baseOverlap = recommended.filter((kw) => origWords.includes(String(kw).toLowerCase())).length;
    const titleImprovementPercent = Math.max(0, Math.min(100, (overlap - baseOverlap) * 12));

    // Readability heuristic based on description length and sentence structure
    const len = (contentRow?.optimized_description || '').length;
    const readability = Math.max(40, Math.min(95, Math.round(60 + (600 - Math.abs(600 - len)) / 40)));

    // Competitive strength heuristic based on competitor count and tag diversity
    const uniqueTags = tagMap.size;
    const compCount = compRows.length;
    const competitiveStrength = Math.max(10, Math.min(100, Math.round(30 + Math.min(20, compCount) * 2 + Math.min(40, uniqueTags))));

    // Expected boost derived from seo_score and improvement
    const seoScore = Number(contentRow?.seo_score ?? 70);
    const expectedBoost = Math.max(1, Math.min(60, Math.round((seoScore - 50) * 0.6 + titleImprovementPercent * 0.4)));

    // Overlap list to show in Keywords tab
    const competitorKeywordSet = new Set(allCompKeywords.map((k) => String(k).toLowerCase()));
    const recommendedInCompetitors = recommended.filter((kw) => competitorKeywordSet.has(String(kw).toLowerCase()));

    // Real-time keyword metrics using SerpAPI Google Trends
    let keywordMetrics: any[] = [];
    try {
      if (recommended.length) {
        const ks = new KeywordsService();
        const metrics = await ks.getMetrics(recommended, "IN");
        keywordMetrics = metrics.map((m) => {
          // Simple volume estimate heuristic from interest
          const volume_estimate = Math.max(50, Math.round(m.avgInterest * 120));
          // CPC placeholder (can integrate paid providers later)
          const cpc_estimate = null as number | null;
          // Explainability badge
          let badge = "Stable";
          let reason = "Consistent demand.";
          if (m.momentum >= 20 && m.avgInterest >= 40) { badge = "Rising Fast"; reason = "High interest with strong positive momentum."; }
          else if (m.momentum >= 5 && m.avgInterest >= 60) { badge = "High & Rising"; reason = "High baseline and rising."; }
          else if (m.momentum <= -20) { badge = "Falling"; reason = "Declining momentum recently."; }
          else if (m.avgInterest >= 70) { badge = "High & Stable"; reason = "High sustained interest."; }

          const recommendation = m.avgInterest >= 50 ? (m.momentum >= 0 ? "Use" : "Monitor") : (m.momentum > 10 ? "Test" : "Avoid");

          return ({
            keyword: m.keyword,
            avgInterest: m.avgInterest,
            momentum: m.momentum,
            samples: m.samples,
            volume_estimate,
            cpc_estimate,
            badge,
            reason,
            recommendation,
          });
        });

        // Persist metrics (upsert)
        const upsertPayload = keywordMetrics.map((k) => ({
          analysis_id: id,
          keyword: k.keyword,
          avg_interest: k.avgInterest,
          momentum: k.momentum,
          volume_estimate: k.volume_estimate,
          cpc_estimate: k.cpc_estimate,
          samples: k.samples,
          badge: k.badge,
          reason: k.reason,
        }));
        await supabaseServer.from("keyword_metrics").upsert(upsertPayload, { onConflict: "analysis_id,keyword" });
      }
    } catch {}

    return NextResponse.json({
      analysis,
      content: contentRow,
      competitors: compRows,
      metrics: {
        keywordDensityPercent,
        readability,
        competitiveStrength,
        expectedBoost,
        titleImprovementPercent,
      },
      tags: {
        top: topTags,
        totalUnique: uniqueTags,
      },
      keywordOverlap: {
        recommendedInCompetitors,
      },
      keywordMetrics,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unexpected error" }, { status: 500 });
  }
}
