import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/lib/env";

export interface GeminiRequest {
  productName: string;
  productDescription: string;
  competitorTitles: string[];
  extractedKeywords: string[];
  targetPlatform: string;
}

export class GeminiService {
  private genai = new GoogleGenerativeAI(env.GEMINI_API_KEY);

  async generateOptimizedContent(req: GeminiRequest): Promise<{
    title: string;
    description: string;
    keywords: string[];
    seoScore: number;
  }> {
    // Placeholder prompt; refine in Phase 5
    const prompt = `You are an eCommerce SEO expert. Generate an optimized title, description and 15-25 keywords for ${req.targetPlatform}.\nProduct: ${req.productName}\nDescription: ${req.productDescription}\nCompetitor Titles: ${req.competitorTitles.join(", ")}\nKeywords: ${req.extractedKeywords.join(", ")}`;

    const model = this.genai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const res = await model.generateContent(prompt);
    const text = res.response.text();

    // Very basic parsing placeholder
    const title = text.split("\n").find((l) => l.toLowerCase().startsWith("title:"))?.split(":")[1]?.trim() ?? req.productName;
    const description = text.substring(0, 800);
    const keywords = Array.from(new Set(req.extractedKeywords)).slice(0, 25);
    const seoScore = Math.min(100, 70 + Math.floor(Math.random() * 20));

    return { title, description, keywords, seoScore };
  }
}
