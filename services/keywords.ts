import { env } from "@/lib/env";

export type KeywordMetric = {
  keyword: string;
  avgInterest: number; // 0-100
  momentum: number; // -100..100 (last value - first value)
  samples: number[]; // normalized series
};

const cache = new Map<string, KeywordMetric>();

async function fetchTrend(keyword: string, geo = "IN"): Promise<KeywordMetric | null> {
  if (!env.SERPAPI_KEY) return null;
  const key = `${geo}::${keyword.toLowerCase()}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_trends");
  url.searchParams.set("q", keyword);
  url.searchParams.set("data_type", "TIMESERIES");
  url.searchParams.set("geo", geo);
  url.searchParams.set("api_key", env.SERPAPI_KEY);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 0 }, signal: controller.signal });
    if (!res.ok) return null;
    const json: any = await res.json();
    const series: number[] = (json?.interest_over_time?.timeline_data || [])
      .map((d: any) => Number(d?.values?.[0]?.value ?? 0))
      .filter((v: any) => Number.isFinite(v));
    if (!series.length) return null;
    const sum = series.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / series.length);
    const momentum = Math.max(-100, Math.min(100, Math.round(series[series.length - 1] - series[0])));
    const metric: KeywordMetric = { keyword, avgInterest: avg, momentum, samples: series.slice(-12) };
    cache.set(key, metric);
    return metric;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export class KeywordsService {
  // fetch metrics for up to 20 keywords, in batches, with caching
  async getMetrics(keywords: string[], geo = "IN"): Promise<KeywordMetric[]> {
    const uniq = Array.from(new Set(keywords.map((k) => k.trim().toLowerCase()).filter(Boolean))).slice(0, 20);
    const out: KeywordMetric[] = [];
    const batchSize = 5;
    for (let i = 0; i < uniq.length; i += batchSize) {
      const batch = uniq.slice(i, i + batchSize);
      const results = await Promise.all(batch.map((k) => fetchTrend(k, geo)));
      for (let j = 0; j < batch.length; j++) {
        const m = results[j];
        if (m) out.push(m);
      }
    }
    // sort by avgInterest desc then momentum desc
    out.sort((a, b) => (b.avgInterest - a.avgInterest) || (b.momentum - a.momentum));
    return out;
  }
}
