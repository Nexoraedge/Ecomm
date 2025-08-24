import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-ssr";
import { supabaseServer } from "@/lib/supabase";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan } = await req.json().catch(() => ({}));
    if (!plan || plan !== "pro") {
      return NextResponse.json({ error: "Unsupported plan" }, { status: 400 });
    }

    // Resolve our internal user id
    const { data: dbUser, error: userErr } = await supabaseServer
      .from("users")
      .select("id, email")
      .eq("auth_user_id", authData.user.id)
      .single();
    if (userErr || !dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Fallback: direct buy URL if provided (works with UUID variant ids)
    if (env.LEMONSQUEEZY_PRO_BUY_URL) {
      const url = new URL(env.LEMONSQUEEZY_PRO_BUY_URL);
      // Prefill useful fields
      if (dbUser.email) url.searchParams.set("checkout[email]", dbUser.email);
      url.searchParams.set("checkout[custom][user_id]", String(dbUser.id));
      url.searchParams.set("checkout[custom][auth_user_id]", String(authData.user.id));
      // Redirects after payment
      const successUrl = `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing?status=success`;
      const cancelUrl = `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing?status=cancel`;
      url.searchParams.set("checkout[success_url]", successUrl);
      url.searchParams.set("checkout[cancel_url]", cancelUrl);
      // In-app embed disabled here; hosted checkout will handle redirect
      // You can enable embed by uncommenting below
      // url.searchParams.set("embed", "1")
      return NextResponse.json({ url: url.toString() });
    }

    if (!env.LEMONSQUEEZY_API_KEY || !env.LEMONSQUEEZY_STORE_ID || !env.LEMONSQUEEZY_PRO_VARIANT_ID) {
      return NextResponse.json({ error: "Billing is not fully configured (missing API/IDs). Set LEMONSQUEEZY_PRO_BUY_URL or all API envs." }, { status: 500 });
    }

    const successUrl = `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing?status=success`;
    const cancelUrl = `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing?status=cancel`;

    // Create Lemon Squeezy checkout
    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.LEMONSQUEEZY_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_options: {
              embed: false,
            },
            checkout_data: {
              email: dbUser.email,
              custom: {
                user_id: dbUser.id,
                auth_user_id: authData.user.id,
              },
            },
            preview: env.NODE_ENV !== "production", // let us preview in dev
            expires_at: null,
            test_mode: env.NODE_ENV !== "production",
            redirect_url: successUrl,
            cancel_url: cancelUrl,
          },
          relationships: {
            store: { data: { type: "stores", id: env.LEMONSQUEEZY_STORE_ID } },
            variant: { data: { type: "variants", id: env.LEMONSQUEEZY_PRO_VARIANT_ID } },
          },
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      // Surface API validation problems and suggest using buy URL
      return NextResponse.json({ error: `Lemon API error: ${err}` }, { status: 500 });
    }

    const json = await res.json();
    const url: string | undefined = json?.data?.attributes?.url;
    if (!url) return NextResponse.json({ error: "No checkout URL returned" }, { status: 500 });

    return NextResponse.json({ url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
