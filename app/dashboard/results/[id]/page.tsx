"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Copy,
  Download,
  Save,
  RefreshCw,
  TrendingUp,
  Target,
  Search,
  CheckCircle,
  Star,
  ArrowUpRight,
  FileText,
  Eye,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockResults = {
  productName: "Wireless Bluetooth Headphones with Active Noise Cancellation",
  platform: "Amazon",
  category: "Electronics & Gadgets",
  analysisDate: "2024-01-15T10:30:00Z",
  optimizedTitle:
    "Premium Wireless Bluetooth Headphones - Active Noise Cancelling, 30H Battery Life, Hi-Fi Stereo Sound, Built-in Mic for Calls, Foldable Design - Perfect for Travel, Work & Gaming",
  optimizedDescription: `Experience superior audio quality with these premium wireless Bluetooth headphones featuring advanced active noise cancellation technology. 

🎧 **Key Features:**
• **Active Noise Cancellation** - Block out distractions with industry-leading ANC technology
• **30-Hour Battery Life** - All-day listening with quick 15-minute charge for 3 hours playback
• **Hi-Fi Stereo Sound** - Premium 40mm drivers deliver crystal-clear audio across all frequencies
• **Comfortable Design** - Soft protein leather ear cushions and adjustable headband for extended wear
• **Built-in Microphone** - Crystal-clear hands-free calling with noise reduction
• **Foldable & Portable** - Compact design with carrying case for easy travel

🔊 **Perfect For:**
✓ Daily commuting and travel
✓ Work from home and office calls
✓ Gaming and entertainment
✓ Fitness and outdoor activities

📱 **Universal Compatibility** - Works seamlessly with iPhone, Android, tablets, laptops, and all Bluetooth-enabled devices.

⚡ **What's Included:** Headphones, USB-C charging cable, 3.5mm audio cable, carrying case, user manual

🛡️ **Quality Guarantee** - 2-year warranty with 30-day money-back guarantee. Premium customer support available 24/7.`,
  keywords: [
    { keyword: "wireless bluetooth headphones", volume: 45000, difficulty: "Medium", trend: "+12%" },
    { keyword: "noise cancelling headphones", volume: 33000, difficulty: "High", trend: "+8%" },
    { keyword: "active noise cancellation", volume: 22000, difficulty: "Medium", trend: "+15%" },
    { keyword: "bluetooth headphones with mic", volume: 18000, difficulty: "Low", trend: "+5%" },
    { keyword: "wireless headphones long battery", volume: 12000, difficulty: "Low", trend: "+20%" },
    { keyword: "foldable bluetooth headphones", volume: 8500, difficulty: "Low", trend: "+10%" },
    { keyword: "premium audio headphones", volume: 6200, difficulty: "Medium", trend: "+7%" },
    { keyword: "travel headphones wireless", volume: 4800, difficulty: "Low", trend: "+18%" },
  ],
  competitors: [
    {
      rank: 1,
      title: "Sony WH-1000XM4 Wireless Premium Noise Canceling Overhead Headphones",
      rating: 4.4,
      reviews: 89234,
    },
    {
      rank: 2,
      title: "Bose QuietComfort 45 Bluetooth Wireless Noise Cancelling Headphones",
      rating: 4.3,
      reviews: 67891,
    },
    { rank: 3, title: "Apple AirPods Max - Sky Blue Premium Over-Ear Headphones", rating: 4.5, reviews: 45672 },
    { rank: 4, title: "Sennheiser Momentum 3 Wireless Noise Cancelling Headphones", rating: 4.2, reviews: 34567 },
    { rank: 5, title: "JBL Live 660NC Wireless Over-Ear Noise Cancelling Headphones", rating: 4.1, reviews: 28934 },
  ],
  trendingTags: [
    "Active Noise Cancellation",
    "30H Battery Life",
    "Hi-Fi Stereo",
    "Foldable Design",
    "Premium Quality",
    "Travel Friendly",
    "Gaming Headphones",
    "Work From Home",
  ],
  performanceMetrics: {
    seoScore: 92,
    keywordDensity: 8.5,
    readabilityScore: 85,
    competitiveStrength: 78,
    expectedRankingBoost: 34,
  },
}

export default function ResultsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("content")

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: `${label} has been copied to your clipboard.`,
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExport = (format: "pdf" | "csv") => {
    toast({
      title: `Exporting to ${format.toUpperCase()}`,
      description: "Your analysis results are being prepared for download.",
    })
    // Simulate download
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: `Your ${format.toUpperCase()} file has been downloaded.`,
      })
    }, 2000)
  }

  const handleSaveProject = () => {
    toast({
      title: "Project saved",
      description: "Your analysis has been saved to your projects.",
    })
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analysis Results</h1>
            <p className="text-muted-foreground mt-1">
              {mockResults.productName} • {mockResults.platform} •{" "}
              {new Date(mockResults.analysisDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => handleExport("csv")} className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport("pdf")} className="bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={handleSaveProject} className="bg-transparent">
              <Save className="h-4 w-4 mr-2" />
              Save Project
            </Button>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              New Variation
            </Button>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SEO Score</p>
                  <p className="text-2xl font-bold text-foreground">{mockResults.performanceMetrics.seoScore}/100</p>
                </div>
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Keyword Density</p>
                  <p className="text-2xl font-bold text-foreground">{mockResults.performanceMetrics.keywordDensity}%</p>
                </div>
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Search className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Readability</p>
                  <p className="text-2xl font-bold text-foreground">
                    {mockResults.performanceMetrics.readabilityScore}/100
                  </p>
                </div>
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Competitive Strength</p>
                  <p className="text-2xl font-bold text-foreground">
                    {mockResults.performanceMetrics.competitiveStrength}/100
                  </p>
                </div>
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expected Boost</p>
                  <p className="text-2xl font-bold text-foreground">
                    +{mockResults.performanceMetrics.expectedRankingBoost}%
                  </p>
                </div>
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Optimized Content</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Optimized Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Optimized Title */}
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Optimized Title</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(mockResults.optimizedTitle, "Optimized title")}
                      className="bg-transparent"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <CardDescription>SEO-optimized product title for maximum visibility</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <p className="text-sm leading-relaxed">{mockResults.optimizedTitle}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Length: {mockResults.optimizedTitle.length} characters</span>
                    <Badge variant="secondary">Optimal</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Original vs Optimized Comparison */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Title Comparison</CardTitle>
                  <CardDescription>See the improvement in your product title</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Original Title</Label>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-1">
                      <p className="text-sm">Wireless Bluetooth Headphones with Active Noise Cancellation</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Optimized Title</Label>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg mt-1">
                      <p className="text-sm">{mockResults.optimizedTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">+34% expected ranking boost</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Optimized Description */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Optimized Description</CardTitle>
                    <CardDescription>
                      Enhanced product description with SEO keywords and compelling copy
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(mockResults.optimizedDescription, "Optimized description")}
                    className="bg-transparent"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-muted/30 rounded-lg border border-border">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {mockResults.optimizedDescription}
                    </pre>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Length: {mockResults.optimizedDescription.length} characters</span>
                  <span>Keywords: 8 integrated</span>
                  <Badge variant="secondary">High Converting</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Keywords Tab */}
          <TabsContent value="keywords" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Recommended Keywords</CardTitle>
                <CardDescription>High-performing keywords discovered from competitor analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockResults.keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-foreground">{keyword.keyword}</h4>
                          <Badge
                            variant={
                              keyword.difficulty === "Low"
                                ? "default"
                                : keyword.difficulty === "Medium"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {keyword.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Volume: {keyword.volume.toLocaleString()}/month</span>
                          <span className="text-green-600">Trend: {keyword.trend}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(keyword.keyword, "Keyword")}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Tags */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Trending Tags</CardTitle>
                <CardDescription>Popular tags and phrases in your category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockResults.trendingTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => copyToClipboard(tag, "Tag")}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competitors Tab */}
          <TabsContent value="competitors" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Top Competitors Analysis</CardTitle>
                <CardDescription>Top-ranking products in your category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockResults.competitors.map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="text-xs">
                            #{competitor.rank}
                          </Badge>
                          <h4 className="font-medium text-foreground line-clamp-1">{competitor.title}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{competitor.rating}</span>
                          </div>
                          <span>{competitor.reviews.toLocaleString()} reviews</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">SEO Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Title Optimization</p>
                      <p className="text-sm text-muted-foreground">
                        Added high-volume keywords and benefit-focused language
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Description Enhancement</p>
                      <p className="text-sm text-muted-foreground">
                        Improved readability and added compelling bullet points
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Keyword Integration</p>
                      <p className="text-sm text-muted-foreground">Naturally integrated 8 high-performing keywords</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Performance Prediction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Search Visibility</span>
                      <span className="font-medium">+34%</span>
                    </div>
                    <Progress value={34} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Click-Through Rate</span>
                      <span className="font-medium">+28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conversion Potential</span>
                      <span className="font-medium">+22%</span>
                    </div>
                    <Progress value={22} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
