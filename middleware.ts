// No-op middleware. Auth handled inside API routes via Supabase session.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Let everything pass; specific routes enforce auth server-side
    "/((?!.+\\.[\\w]+$|_next).*)",
  ],
};
