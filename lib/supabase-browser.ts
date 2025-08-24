"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

// Create a browser client that persists session in cookies for SSR compatibility
export function getSupabaseBrowser() {
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
