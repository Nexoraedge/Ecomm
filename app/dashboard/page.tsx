import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Search, Clock, Plus, FileText, ArrowUpRight, Target, Zap } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, Priya!</h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your eCommerce optimization today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              View Reports
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Keywords Found</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platforms Used</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Amazon, Flipkart, Meesho</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Ranking Boost</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+23%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Analyses */}
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Analyses</CardTitle>
                    <CardDescription>Your latest product optimizations</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    View all
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      product: "Wireless Bluetooth Headphones",
                      platform: "Amazon",
                      status: "Completed",
                      improvement: "+34%",
                      date: "2 hours ago",
                    },
                    {
                      product: "Cotton Summer T-Shirt",
                      platform: "Flipkart",
                      status: "Completed",
                      improvement: "+28%",
                      date: "5 hours ago",
                    },
                    {
                      product: "Smartphone Case Cover",
                      platform: "Meesho",
                      status: "Processing",
                      improvement: "Pending",
                      date: "1 day ago",
                    },
                    {
                      product: "Kitchen Cookware Set",
                      platform: "Amazon",
                      status: "Completed",
                      improvement: "+41%",
                      date: "2 days ago",
                    },
                  ].map((analysis, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-foreground">{analysis.product}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {analysis.platform}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {analysis.date}
                          </span>
                          <Badge
                            variant={analysis.status === "Completed" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {analysis.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">{analysis.improvement}</div>
                        <div className="text-xs text-muted-foreground">SEO boost</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed & Quick Actions */}
          <div className="space-y-6">
            {/* Usage Progress */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Monthly Usage</CardTitle>
                <CardDescription>Pro Plan - Unlimited analyses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analyses this month</span>
                    <span className="font-medium">47</span>
                  </div>
                  <Progress value={47} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Keywords discovered</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  New Product Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Search className="h-4 w-4 mr-2" />
                  Keyword Research
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Reports
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "Analysis completed",
                      product: "Wireless Headphones",
                      time: "2h ago",
                      icon: <Zap className="h-4 w-4" />,
                    },
                    {
                      action: "Keywords updated",
                      product: "Summer T-Shirt",
                      time: "5h ago",
                      icon: <Search className="h-4 w-4" />,
                    },
                    {
                      action: "Report exported",
                      product: "Phone Case",
                      time: "1d ago",
                      icon: <FileText className="h-4 w-4" />,
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.product}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
