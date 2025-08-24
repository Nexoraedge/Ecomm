import { ReactNode } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getSupabaseServerClient } from "@/lib/supabase-ssr"

export default async function DashboardRouteLayout({ children }: { children: ReactNode }) {
  const supabase = await getSupabaseServerClient()

  // Ensure session
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const u = user ?? session?.user
  const displayUser = u
    ? {
        name: ((u.user_metadata?.name as string) || u.email || "User") as string,
        email: (u.email || "") as string,
        avatar_url: ((u.user_metadata?.avatar_url as string) || (u.user_metadata?.picture as string) || "") as
          | string
          | undefined,
      }
    : undefined

  return <DashboardLayout user={displayUser}>{children}</DashboardLayout>
}
