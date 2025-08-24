/*
  Temporary relaxed env loader (no runtime throws).
  If a variable is missing, we default to empty string or sensible default.
  This unblocks local development and avoids runtime crashes on /login.
*/

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  NEXT_PUBLIC_APP_URL: (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").trim(),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim(),
  SUPABASE_ANON_KEY: (process.env.SUPABASE_ANON_KEY ?? "").trim(),
  SUPABASE_SERVICE_ROLE_KEY: (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim(),

  // Gemini
  GEMINI_API_KEY: (process.env.GEMINI_API_KEY ?? "").trim(),

  // Search provider for scraping-lite
  SERPAPI_KEY: (process.env.SERPAPI_KEY ?? "").trim(),

  // Lemon Squeezy
  LEMONSQUEEZY_API_KEY: (process.env.LEMONSQUEEZY_API_KEY ?? "").trim(),
  LEMONSQUEEZY_STORE_ID: (process.env.LEMONSQUEEZY_STORE_ID ?? "").trim(),
  LEMONSQUEEZY_PRO_VARIANT_ID: (process.env.LEMONSQUEEZY_PRO_VARIANT_ID ?? "").trim(),
  LEMONSQUEEZY_WEBHOOK_SECRET: (process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? "").trim(),
  // Optional: direct buy URL (UUID-based), e.g. https://your-store.lemonsqueezy.com/buy/<uuid>
  LEMONSQUEEZY_PRO_BUY_URL: (process.env.LEMONSQUEEZY_PRO_BUY_URL ?? "").trim(),
} as const;
