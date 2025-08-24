import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { env } from "@/lib/env";

export async function getSupabaseServerClient() {
  // Next.js 15: cookies() can be async; await to satisfy sync dynamic APIs warning.
  const cookieStore = await cookies();
  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set(name, value, options);
        } catch {}
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set(name, "", options);
        } catch {}
      },
    },
  });
  return supabase;
}
