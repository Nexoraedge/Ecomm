"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CreditCard, Download, Calendar, TrendingUp, CheckCircle, Zap, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const plans = [
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
      "Unlimited analyses",
      "Advanced keyword research",
      "All platform support",
      "Export to PDF/CSV",
      "Priority support",
      "API access",
    ],
    current: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: 99,
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

const billingHistory = [
  { date: "2024-01-15", description: "Pro Plan - Monthly", amount: 29.0, status: "Paid" },
  { date: "2023-12-15", description: "Pro Plan - Monthly", amount: 29.0, status: "Paid" },
  { date: "2023-11-15", description: "Pro Plan - Monthly", amount: 29.0, status: "Paid" },
  { date: "2023-10-15", description: "Pro Plan - Monthly", amount: 29.0, status: "Paid" },
]

export default function BillingPage() {
  const { toast } = useToast()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const handleUpgrade = (planName: string) => {
    toast({
      title: "Plan upgrade initiated",
      description: `Upgrading to ${planName} plan. You'll be redirected to payment.`,
    })
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
      <div className="max-w-6xl mx-auto space-y-8">
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
                    <Badge variant="default">Pro Plan</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">$29/month</h3>
                      <p className="text-sm text-muted-foreground">Billed monthly • Next payment: Feb 15, 2024</p>
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
                        <span>Unlimited analyses</span>
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
                    <Button variant="outline" onClick={() => handleUpgrade("Enterprise")} className="bg-transparent">
                      Upgrade Plan
                    </Button>
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
                      <span className="font-medium">47 / Unlimited</span>
                    </div>
                    <Progress value={47} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>API Calls</span>
                      <span className="font-medium">1,247 / Unlimited</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Exports</span>
                      <span className="font-medium">23 / Unlimited</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>+34% increase from last month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Method */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/2027</p>
                    </div>
                  </div>
                  <Button variant="outline" className="bg-transparent">
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
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
              {plans.map((plan) => (
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
                  <Button variant="outline" className="bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingHistory.map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium text-foreground">{invoice.description}</h4>
                          <Badge variant={invoice.status === "Paid" ? "default" : "secondary"}>{invoice.status}</Badge>
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
                          <div className="font-medium text-foreground">${invoice.amount.toFixed(2)}</div>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
