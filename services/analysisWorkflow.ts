import { supabaseServer } from "@/lib/supabase";
import { CompetitorScraper } from "@/services/scraper";
import { GeminiService } from "@/services/gemini";

export class AnalysisWorkflow {
  private scraper = new CompetitorScraper();
  private gemini = new GeminiService();

  async processAnalysis(analysisId: string) {
    // 1. Update status to 'scanning'
    await supabaseServer.from("product_analyses").update({ status: "scanning" }).eq("id", analysisId);

    // 2. Load analysis input
    const { data: analysis, error } = await supabaseServer
      .from("product_analyses")
      .select("id, product_name, product_description, target_platform")
      .eq("id", analysisId)
      .single();
    if (error || !analysis) throw error ?? new Error("Analysis not found");

    // 3. Scrape competitor data (placeholder)
    const results = await this.scrapeByPlatform(analysis.target_platform, analysis.product_name);

    // 4. Persist competitor_data
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
