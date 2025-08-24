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
  NEXT_PUBLIC_SUPABASE_ANON_KEY: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim(),
  SUPABASE_SERVICE_ROLE_KEY: (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim(),

  // Gemini
  GEMINI_API_KEY: (process.env.GEMINI_API_KEY ?? "").trim(),
} as const;
