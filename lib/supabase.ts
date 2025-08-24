import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

// Browser client for client-side (uses anon key). Use sparingly; prefer server routes.
export const supabaseBrowser = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_ANON_KEY
);

// Server client with service role for privileged ops (ONLY on server/API routes)
export const supabaseServer = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false },
    db: { schema: "public" },
  }
);
