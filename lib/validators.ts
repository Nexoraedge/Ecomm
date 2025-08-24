import { z } from "zod";

export const createAnalysisSchema = z.object({
  productName: z.string().min(2),
  productDescription: z.string().optional().default(""),
  productFeatures: z.string().optional(),
  category: z.string().optional(),
  targetPlatform: z.enum(["amazon", "flipkart", "meesho"]),
});

export const reportBugSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  category: z.enum(["bug", "feature_request", "general"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  screenshotUrl: z.string().url().optional(),
  browserInfo: z.record(z.any()).optional(),
});
