"use client"
import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Plus, LogOut, CreditCard } from "lucide-react"
import Link from "next/link"
import { BugReport } from "@/components/bug-report"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { getSupabaseBrowser } from "@/lib/supabase-browser"
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "New Analysis", href: "/dashboard/analyze", icon: Plus },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    email: string
    avatar_url?: string
  }
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = getSupabaseBrowser()

  const [clientUser, setClientUser] = useState<{
    name: string
    email: string
    avatar_url?: string
  } | null>(null)
  const [plan, setPlan] = useState<string>("free")
  const [creditsLeft, setCreditsLeft] = useState<number | null>(null)
  const [usageThisMonth, setUsageThisMonth] = useState<number>(0)

  useEffect(() => {
    if (user) return
    let active = true
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      const u = data.user
      if (u) {
        setClientUser({
          name: (u.user_metadata?.name as string) || u.email || "User",
          email: u.email || "",
          avatar_url: (u.user_metadata?.avatar_url as string) || (u.user_metadata?.picture as string) || "",
        })

        // Load plan and usage for sidebar
        ;(async () => {
          try {
            // users row
            const { data: profile } = await supabase
              .from("users")
              .select("subscription_plan, analyses_remaining, id")
              .eq("auth_user_id", u.id)
              .single()
            if (profile) {
              setPlan(profile.subscription_plan ?? "free")
              setCreditsLeft(typeof profile.analyses_remaining === "number" ? profile.analyses_remaining : null)

              // usage this month
              const now = new Date()
              const first = new Date(now.getFullYear(), now.getMonth(), 1)
              const { count } = await supabase
                .from("product_analyses")
                .select("id", { count: "exact", head: true })
                .eq("user_id", profile.id)
                .gte("created_at", first.toISOString())
                .lte("created_at", now.toISOString())
              setUsageThisMonth(count ?? 0)
            }
          } catch {}
        })()
      }
    })
    return () => {
      active = false
    }
  }, [user, supabase])

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const safeUser = useMemo(() => {
    return {
      name: user?.name ?? clientUser?.name ?? "User",
      email: user?.email ?? clientUser?.email ?? "",
      avatar_url: user?.avatar_url ?? clientUser?.avatar_url,
    }
  }, [user, clientUser])
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar className="border-r border-border">
          <SidebarHeader className="border-b border-border p-6">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/Logo.png" alt="Logo" width={32} height={32} className="rounded" />
              <span className="text-xl font-bold text-foreground">SEO Boost</span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname ? pathname === item.href || pathname.startsWith(item.href + "/") : false}
                  >
                    <Link href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            {/* Plan Status (real-time) */}
            <div className="mt-8 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium capitalize">{plan === "pro" ? "Pro" : plan || "Free"} Plan</span>
                <Badge variant={plan === "pro" ? "default" : "secondary"} className="text-xs">
                  {plan === "pro" ? "Active" : "Free"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{usageThisMonth} analyses this month</p>
              <p className="text-xs text-muted-foreground mb-3">Credits left: {creditsLeft ?? "—"}</p>
              <Button size="sm" variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/dashboard/billing">{plan === "pro" ? "Manage" : "Upgrade"}</Link>
              </Button>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-border p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={safeUser.avatar_url || undefined} alt={safeUser.name} />
                <AvatarFallback>{(safeUser.name || "U").slice(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{safeUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">{safeUser.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut} title="Log out">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Page Content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>

      <BugReport />
    </SidebarProvider>
  )
}
