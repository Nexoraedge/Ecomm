import { getSupabaseServerClient } from "@/lib/supabase-ssr"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { supabaseServer } from "@/lib/supabase"
import { BugReport } from "@/components/bug-report"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await getSupabaseServerClient()
  // If returning from OAuth provider, exchange code for a session on the server
  const sp = (await searchParams) ?? {}
  const codeParam = sp?.code
  if (typeof codeParam === "string" && codeParam.length > 0) {
    // Delegate code exchange to a route handler that can set cookies reliably
    redirect(`/auth/callback?code=${encodeURIComponent(codeParam)}&redirect=${encodeURIComponent("/dashboard")}`)
  }
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!user && !session) {
    redirect("/login")
  }

  const displayUser = user ?? session?.user
  const displayName =
    (displayUser?.user_metadata?.name as string | undefined) ?? displayUser?.email ?? "User"

  // Fetch previous analyses and recent bug reports for this user
  let analyses: Array<{
    id: string
    product_name: string
    target_platform: string
    status: string
    created_at: string
    completed_at: string | null
  }> = []
  let bugReports: Array<{ id: string; title: string; status: string; priority: string; created_at: string }> = []
  let plan: string | null = null
  let creditsLeft: number | null = null
  let usageThisMonth = 0
  try {
    const { data: dbUser } = await supabaseServer
      .from("users")
      .select("id, subscription_plan, analyses_remaining")
      .eq("auth_user_id", displayUser!.id)
      .single()

    if (dbUser?.id) {
      plan = dbUser.subscription_plan ?? "free"
      creditsLeft = typeof dbUser.analyses_remaining === "number" ? dbUser.analyses_remaining : null

      // Count analyses for current month
      const now = new Date()
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const { count: monthlyCount } = await supabaseServer
        .from("product_analyses")
        .select("id", { count: "exact", head: true })
        .eq("user_id", dbUser.id)
        .gte("created_at", firstOfMonth.toISOString())
        .lte("created_at", now.toISOString())
      usageThisMonth = monthlyCount ?? 0
      const { data: history } = await supabaseServer
        .from("product_analyses")
        .select("id, product_name, target_platform, status, created_at, completed_at")
        .eq("user_id", dbUser.id)
        .order("created_at", { ascending: false })
        .limit(10)

      analyses = history ?? []

      const { data: reports } = await supabaseServer
        .from("bug_reports")
        .select("id, title, status, priority, created_at")
        .eq("user_id", dbUser.id)
        .order("created_at", { ascending: false })
        .limit(5)

      bugReports = reports ?? []
    }
  } catch {}

  return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {displayName}!</h1>
            <p className="text-muted-foreground mt-1">Get started by running a new analysis.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="bg-transparent" asChild>
              <Link href="/dashboard/analyze">New Analysis</Link>
            </Button>
          </div>
        </div>

        {/* Usage & Billing */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Usage & Billing</CardTitle>
            <CardDescription>Your current plan and credits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <div>
                <div className="text-sm text-muted-foreground">Plan</div>
                <div className="text-lg font-medium capitalize">{plan ?? "free"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Credits Left</div>
                <div className="text-lg font-medium">{creditsLeft ?? "—"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Usage This Month</div>
                <div className="text-lg font-medium">{usageThisMonth}</div>
              </div>
              <div className="flex sm:justify-end">
                <Button variant="outline" className="bg-transparent" asChild>
                  <Link href="/dashboard/billing">Manage Billing</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Recent Analyses</CardTitle>
                <CardDescription>Your latest product optimizations will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                {analyses.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No analyses yet. Start your first one from Analyze.</div>
                ) : (
                  <div className="space-y-3">
                    {analyses.map((a) => (
                      <div key={a.id} className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <div className="font-medium">{a.product_name}</div>
                          <div className="text-xs text-muted-foreground">
                            Platform: {a.target_platform} • Status: {a.status} • {new Date(a.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/dashboard/results/${a.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Recent Bug Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {bugReports.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No bug reports yet.</div>
                ) : (
                  <div className="space-y-3">
                    {bugReports.map((r) => (
                      <div key={r.id} className="rounded-md border p-3">
                        <div className="text-sm font-medium">{r.title}</div>
                        <div className="text-xs text-muted-foreground">{r.status} • {r.priority} • {new Date(r.created_at).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Floating bug report button */}
        <BugReport />
      </div>
  )
}
