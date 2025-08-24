import { NextRequest, NextResponse } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { env } from "@/lib/env"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const redirectTo = url.searchParams.get("redirect") || "/dashboard"

  // Prepare a response we can attach cookies to
  const redirectUrl = new URL(redirectTo, req.url)
  const res = NextResponse.redirect(redirectUrl)

  if (!code) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Create a Supabase client that reads cookies from the request and writes to the response
  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          res.cookies.set({ name, value, ...options })
        } catch {}
      },
      remove(name: string, options: CookieOptions) {
        try {
          res.cookies.set({ name, value: "", ...options })
        } catch {}
      },
    },
  })

  try {
    await supabase.auth.exchangeCodeForSession(code)
  } catch {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return res
}
