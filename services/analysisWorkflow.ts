import { supabaseServer } from "@/lib/supabase";
import { CompetitorScraper } from "@/services/scraper";
import { GeminiService } from "@/services/gemini";

export class AnalysisWorkflow {
  private scraper = new CompetitorScraper();
  private gemini = new GeminiService();

  async processAnalysis(analysisId: string) {
    try {
      // 1. Update status to 'scanning'
      await supabaseServer.from("product_analyses").update({ status: "scanning" }).eq("id", analysisId);

      // 2. Load analysis input
      const { data: analysis, error } = await supabaseServer
        .from("product_analyses")
        .select("id, product_name, product_description, target_platform")
        .eq("id", analysisId)
        .single();
      if (error || !analysis) throw error ?? new Error("Analysis not found");

      // 3. Load existing competitor_data first to avoid re-scraping and burning API quota
      const { data: existingCompetitors } = await supabaseServer
        .from("competitor_data")
        .select("competitor_title, competitor_url, extracted_keywords, price, rating")
        .eq("analysis_id", analysisId);

      let results: { title: string; url: string; keywords: string[]; price?: number; rating?: number }[] = (existingCompetitors ?? []).map((r) => ({
        title: r.competitor_title as string,
        url: (r as any).competitor_url as string,
        keywords: (r.extracted_keywords as string[]) || [],
        price: r.price ?? undefined,
        rating: r.rating ?? undefined,
      }));

      if (!results.length) {
        // 3b. Only when empty, scrape via platform provider
        const scraped = await this.scrapeByPlatform(analysis.target_platform, analysis.product_name);
        // Deduplicate by URL/title and limit to 20
        const seen = new Set<string>();
        results = [];
        for (const r of scraped) {
          const key = (r.url || r.title).toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          results.push(r);
          if (results.length >= 20) break;
        }
        if (results.length) {
          const payload = results.map((r) => ({
            analysis_id: analysisId,
            competitor_title: r.title,
            competitor_url: r.url,
            extracted_keywords: r.keywords,
            ranking_position: null,
            price: r.price ?? null,
            rating: r.rating ?? null,
          }));
          await supabaseServer.from("competitor_data").insert(payload);
        }
      }

      // 5. Generate content via Gemini
      const competitorTitles = results.map((r) => r.title);
      const extractedKeywords = results.flatMap((r) => r.keywords);
      const gen = await this.gemini.generateOptimizedContent({
        productName: analysis.product_name,
        productDescription: analysis.product_description ?? "",
        competitorTitles,
        extractedKeywords,
        targetPlatform: analysis.target_platform,
      });

      await supabaseServer.from("generated_content").insert({
        analysis_id: analysisId,
        optimized_title: gen.title,
        optimized_description: gen.description,
        recommended_keywords: gen.keywords,
        seo_score: gen.seoScore,
        gemini_prompt: "",
        gemini_response: "",
      });

      // 6. Update status to 'completed'
      await supabaseServer
        .from("product_analyses")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", analysisId);
    } catch (e: any) {
      console.error("AnalysisWorkflow failed", { analysisId, error: e?.message || e });
      await supabaseServer
        .from("product_analyses")
        .update({ status: "failed" })
        .eq("id", analysisId);
      throw e;
    }
  }

  private async scrapeByPlatform(platform: string, productName: string) {
    switch (platform) {
      case "amazon":
        return this.scraper.scrapeAmazon(productName);
      case "flipkart":
        return this.scraper.scrapeFlipkart(productName);
      case "meesho":
        return this.scraper.scrapeMeesho(productName);
      default:
        return [];
    }
  }
}
