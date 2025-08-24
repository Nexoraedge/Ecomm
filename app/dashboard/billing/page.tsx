"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Download, Calendar, TrendingUp, CheckCircle, Zap, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowser } from "@/lib/supabase-browser"

const initialPlans = [
  {
    name: "Free",
    price: 0,
    period: "month",
    description: "Perfect for testing",
    features: ["5 analyses per month", "Basic keyword research", "Single platform support", "Email support"],
    current: false,
  },
  {
    name: "Pro",
    price: 29,
    period: "month",
    description: "Most popular choice",
    features: [
      "600 analyses/month",
      "Advanced keyword research",
      "All platform support",
      "Export to PDF/CSV",
      "Priority support",
      "API access",
    ],
    current: false,
    popular: true,
  },
  {
    name: "Enterprise",
    price: 29,
    period: "month",
    description: "For large teams",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom integrations",
      "Dedicated support",
      "Advanced analytics",
      "White-label options",
    ],
    current: false,
  },
]

type OrderItem = {
  id: string
  date: string
  description: string
  amount: number
  currency: string
  status: string
}

export default function BillingPage() {
  const { toast } = useToast()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [plansState, setPlansState] = useState(initialPlans)
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro" | "enterprise">("free")
  const [loadingPlan, setLoadingPlan] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [monthlyAnalyses, setMonthlyAnalyses] = useState<number>(0)
  const [history, setHistory] = useState<OrderItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  const supabase = getSupabaseBrowser()

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const { data } = await supabase.auth.getUser()
        const u = data.user
        if (!u) return
        const { data: profile } = await supabase
          .from("users")
          .select("subscription_plan, id")
          .eq("auth_user_id", u.id)
          .single()
        const plan = (profile?.subscription_plan as string) || "free"
        if (!active) return
        setCurrentPlan(plan === "pro" ? "pro" : plan === "enterprise" ? "enterprise" : "free")
        setPlansState((prev) =>
          prev.map((p) => ({ ...p, current: p.name.toLowerCase() === (plan || "free") }))
        )

        if (profile?.id) {
          setUserId(profile.id)
          // Monthly usage count
          const now = new Date()
          const first = new Date(now.getFullYear(), now.getMonth(), 1)
          const { count } = await supabase
            .from("product_analyses")
            .select("id", { count: "exact", head: true })
            .eq("user_id", profile.id)
            .gte("created_at", first.toISOString())
            .lte("created_at", now.toISOString())
          setMonthlyAnalyses(count ?? 0)
        }
      } finally {
        if (active) setLoadingPlan(false)
      }
    })()
    return () => {
      active = false
    }
  }, [supabase])

  // After returning from checkout, sync plan/credits if no webhooks configured
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("status") !== "success") return
    ;(async () => {
      try {
        const r = await fetch("/api/billing/sync", { method: "POST" })
        const j = await r.json().catch(() => ({}))
        if (!r.ok || j?.ok === false) {
          toast({ title: "Could not sync subscription", description: j?.error || j?.reason || "Please try again.", variant: "destructive" })
          return
        }
        // Refresh plan and usage
        const { data } = await supabase.auth.getUser()
        const u = data.user
        if (u) {
          const { data: profile } = await supabase
            .from("users")
            .select("subscription_plan, id")
            .eq("auth_user_id", u.id)
            .single()
          const plan = (profile?.subscription_plan as string) || "free"
          setCurrentPlan(plan === "pro" ? "pro" : plan === "enterprise" ? "enterprise" : "free")
          setPlansState((prev) => prev.map((p) => ({ ...p, current: p.name.toLowerCase() === (plan || "free") })))
          if (profile?.id) {
            const now = new Date()
            const first = new Date(now.getFullYear(), now.getMonth(), 1)
            const { count } = await supabase
              .from("product_analyses")
              .select("id", { count: "exact", head: true })
              .eq("user_id", profile.id)
              .gte("created_at", first.toISOString())
              .lte("created_at", now.toISOString())
            setMonthlyAnalyses(count ?? 0)
          }
        }
        toast({ title: "Subscription activated", description: "Your Pro plan is now active with 600 credits." })
      } catch (e: any) {
        toast({ title: "Sync failed", description: e?.message || "Unexpected error" , variant: "destructive" })
      }
    })()
  }, [supabase, toast])

  // Load billing history from API
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch("/api/billing/history")
        if (!res.ok) throw new Error("Failed to load billing history")
        const j = await res.json()
        setHistory((j.data || []) as OrderItem[])
      } catch {
        setHistory([])
      } finally {
        if (active) setLoadingHistory(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const handleUpgrade = async (planName: string) => {
    if (planName.toLowerCase() !== "pro") {
      toast({ title: "Unsupported plan", description: "Only Pro is available via checkout.", variant: "destructive" })
      return
    }
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Failed to start checkout")
      }
      const j = await res.json()
      const url = j.url as string
      if (url) {
        window.location.href = url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (e: any) {
      toast({ title: "Checkout error", description: e?.message || "Unexpected error", variant: "destructive" })
    }
  }

  const handleDowngrade = () => {
    toast({
      title: "Plan downgrade requested",
      description: "Your plan will be downgraded at the end of the current billing cycle.",
    })
  }

  const downloadInvoice = (date: string) => {
    toast({
      title: "Downloading invoice",
      description: `Invoice for ${date} is being prepared for download.`,
    })
  }

  return (
    <DashboardLayout>
      <div className="w-full px-4 md:px-8 py-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-2">Manage your subscription and billing information</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="history">Billing History</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Plan */}
              <Card className="border-border lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Current Plan
                      </CardTitle>
                      <CardDescription>Your active subscription details</CardDescription>
                    </div>
                    <Badge variant={currentPlan === "pro" ? "default" : "secondary"}>
                      {currentPlan === "pro" ? "Pro Plan" : currentPlan === "enterprise" ? "Enterprise" : "Free Plan"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {currentPlan === "pro" ? "$29/month" : currentPlan === "enterprise" ? "$99/month" : "$0/month"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentPlan === "free" ? "Free plan • Upgrade anytime" : "Billed monthly • Auto-renewal enabled"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">Auto-renewal enabled</p>
                      <p className="text-xs text-muted-foreground">Cancel anytime</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Plan benefits</span>
                      <span className="text-green-600">All features included</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>600 analyses/month</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>All platforms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Priority support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>API access</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {currentPlan !== "pro" && (
                      <Button variant="outline" onClick={() => handleUpgrade("Pro")} className="bg-transparent">
                        Upgrade to Pro
                      </Button>
                    )}
                    <Button variant="outline" onClick={handleDowngrade} className="bg-transparent">
                      Manage Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Stats */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Usage This Month</CardTitle>
                  <CardDescription>Your current usage statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyses</span>
                      <span className="font-medium">
                        {monthlyAnalyses} / {currentPlan === "pro" ? 600 : 5}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(100, (monthlyAnalyses / (currentPlan === "pro" ? 600 : 5)) * 100)}
                      className="h-2"
                    />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>Stay within your monthly limit to keep generating insights</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          </TabsContent>

          {/* Plans */}
          <TabsContent value="plans" className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Choose Your Plan</h2>
              <p className="text-muted-foreground">Upgrade or downgrade your subscription anytime</p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4">
                <span className={billingCycle === "monthly" ? "font-medium" : "text-muted-foreground"}>Monthly</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                  className="bg-transparent"
                >
                  {billingCycle === "monthly" ? "Switch to Yearly" : "Switch to Monthly"}
                </Button>
                <span className={billingCycle === "yearly" ? "font-medium" : "text-muted-foreground"}>
                  Yearly
                  <Badge variant="secondary" className="ml-2">
                    Save 20%
                  </Badge>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plansState.map((plan) => (
                <Card
                  key={plan.name}
                  className={`border-border relative ${plan.popular ? "border-primary shadow-lg" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-foreground mt-4">
                      ${billingCycle === "yearly" ? Math.round(plan.price * 12 * 0.8) : plan.price}
                      <span className="text-base font-normal text-muted-foreground">
                        /{billingCycle === "yearly" ? "year" : "month"}
                      </span>
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={plan.current ? "outline" : plan.popular ? "default" : "outline"}
                      onClick={() => !plan.current && handleUpgrade(plan.name)}
                      disabled={plan.current}
                    >
                      {plan.current ? "Current Plan" : `Upgrade to ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Billing History */}
          <TabsContent value="history" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Billing History
                    </CardTitle>
                    <CardDescription>View and download your past invoices</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingHistory ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : history.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No invoices found yet.</p>
                ) : (
                  <div className="space-y-4">
                    {history.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-medium text-foreground">{invoice.description}</h4>
                            <Badge variant={invoice.status?.toLowerCase() === "paid" ? "default" : "secondary"}>{invoice.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(invoice.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium text-foreground">{invoice.currency} {invoice.amount.toFixed(2)}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadInvoice(invoice.date)}
                            className="bg-transparent"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
