"use client"

import { Label } from "@/components/ui/label"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
import { useParams, useRouter } from "next/navigation"

type Analysis = {
  id: string
  product_name: string
  product_description: string | null
  category: string | null
  target_platform: string
  status: string
  created_at: string
  completed_at: string | null
}

type Content = {
  optimized_title: string
  optimized_description: string
  recommended_keywords: string[] | null
  seo_score: number | null
}

type Metrics = {
  keywordDensityPercent: number
  readability: number
  competitiveStrength: number
  expectedBoost: number
  titleImprovementPercent: number
}

type TagsAgg = {
  top: { tag: string; count: number }[]
  totalUnique: number
}

type KeywordOverlap = {
  recommendedInCompetitors: string[]
}

type KeywordMetricRow = {
  keyword: string
  avgInterest: number
  momentum: number
  samples: number[]
  recommendation: string
  volume_estimate?: number | null
  cpc_estimate?: number | null
  badge?: string
  reason?: string
}

type Competitor = {
  competitor_title: string
  rating?: number | null
  price?: number | null
}

export default function ResultsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState("content")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [content, setContent] = useState<Content | null>(null)
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [tags, setTags] = useState<TagsAgg | null>(null)
  const [overlap, setOverlap] = useState<KeywordOverlap | null>(null)
  const [keywordMetrics, setKeywordMetrics] = useState<KeywordMetricRow[]>([])

  useEffect(() => {
    const id = params?.id
    if (!id) return
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/analysis/${id}`)
        if (res.status === 401) {
          router.push("/login")
          return
        }
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Failed to load analysis")
        const j = await res.json()
        setAnalysis(j.analysis)
        setContent(j.content)
        setCompetitors(j.competitors || [])
        setMetrics(j.metrics || null)
        setTags(j.tags || null)
        setOverlap(j.keywordOverlap || null)
        setKeywordMetrics(j.keywordMetrics || [])
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e)
        setError(message || "Unexpected error")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params?.id, router])

  const header = useMemo(() => {
    return {
      productName: analysis?.product_name || "Analysis",
      platform: analysis?.target_platform || "—",
      analysisDate: analysis?.created_at || new Date().toISOString(),
    }
  }, [analysis])

  // Improvement styling helpers
  const titleImprovement = metrics?.titleImprovementPercent ?? 0
  const improvementColor =
    titleImprovement > 0 ? "text-green-600" : titleImprovement < 0 ? "text-red-600" : "text-muted-foreground"
  const improvementPrefix = titleImprovement > 0 ? "+" : ""

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: `${label} has been copied to your clipboard.`,
      })
    } catch {
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
      <div className="max-w-6xl mx-auto space-y-8">
        {loading && (
          <div className="text-center text-muted-foreground">Loading analysis...</div>
        )}
        {error && (
          <div className="text-center text-red-600">{error}</div>
        )}
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analysis Results</h1>
            <p className="text-muted-foreground mt-1">
              {header.productName} • {header.platform} • {new Date(header.analysisDate).toLocaleDateString()}
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
                  <p className="text-2xl font-bold text-foreground">{content?.seo_score ?? 0}/100</p>
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
                  <p className="text-2xl font-bold text-foreground">{metrics?.keywordDensityPercent ?? 0}%</p>
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
                  <p className="text-2xl font-bold text-foreground">{metrics?.readability ?? 0}/100</p>
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
                  <p className="text-2xl font-bold text-foreground">{metrics?.competitiveStrength ?? 0}/100</p>
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
                  <p className="text-2xl font-bold text-foreground">+{metrics?.expectedBoost ?? 0}%</p>
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
                      onClick={() => copyToClipboard(content?.optimized_title || "", "Optimized title")}
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
                    <p className="text-sm leading-relaxed">{content?.optimized_title || "—"}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Length: {(content?.optimized_title || "").length} characters</span>
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
                      <p className="text-sm">{analysis?.product_name || "—"}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Optimized Title</Label>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg mt-1">
                      <p className="text-sm">{content?.optimized_title || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className={`h-4 w-4 ${improvementColor}`} />
                    <span className={`${improvementColor} font-medium`}>
                      {improvementPrefix}
                      {titleImprovement}% title improvement
                    </span>
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
                    onClick={() => copyToClipboard(content?.optimized_description || "", "Optimized description")}
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
                      {content?.optimized_description || "—"}
                    </pre>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Length: {(content?.optimized_description || "").length} characters</span>
                  <span>Keywords: {content?.recommended_keywords?.length ?? 0} integrated</span>
                  <Badge variant="secondary">High Converting</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Keywords Tab */}
          <TabsContent value="keywords" className="space-y-6">
            {/* Overlap summary */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Keyword Coverage</CardTitle>
                <CardDescription>
                  {metrics ? `${metrics.keywordDensityPercent}% of recommended keywords are used in the description` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {overlap?.recommendedInCompetitors?.length ?? 0} of {content?.recommended_keywords?.length ?? 0} keywords are also used by competitors
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Recommended Keywords</CardTitle>
                <CardDescription>High-performing keywords discovered from competitor analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(content?.recommended_keywords ?? []).map((kw, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-foreground">{kw}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Suggested keyword</span>
                          {overlap?.recommendedInCompetitors?.includes(kw) && (
                            <Badge variant="secondary">Competitors use this</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(kw, "Keyword")}
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
                <CardDescription>Popular tags and phrases among top competitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(tags?.top ?? []).map(({ tag, count }, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => copyToClipboard(tag, "Tag")}
                    >
                      {tag} • {count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Keyword Metrics (real-time) */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Keyword Metrics (Real-time)</CardTitle>
                <CardDescription>Interest and momentum from Google Trends via SerpAPI</CardDescription>
              </CardHeader>
              <CardContent>
                {keywordMetrics.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground">
                          <th className="py-2 pr-4 font-medium">Keyword</th>
                          <th className="py-2 pr-4 font-medium">Interest</th>
                          <th className="py-2 pr-4 font-medium">Momentum</th>
                          <th className="py-2 pr-4 font-medium">Volume</th>
                          <th className="py-2 pr-4 font-medium">CPC</th>
                          <th className="py-2 pr-4 font-medium">Badge</th>
                          <th className="py-2 pr-4 font-medium">Recommendation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {keywordMetrics.map((row, i) => (
                          <tr key={i} className="border-t border-border">
                            <td className="py-2 pr-4">
                              <span className="text-foreground">{row.keyword}</span>
                            </td>
                            <td className="py-2 pr-4">
                              <span className="font-medium text-foreground">{row.avgInterest}</span>
                              <span className="text-muted-foreground">/100</span>
                            </td>
                            <td className="py-2 pr-4">
                              <span className={row.momentum >= 0 ? "text-green-600" : "text-red-600"}>
                                {row.momentum >= 0 ? "+" : ""}{row.momentum}
                              </span>
                            </td>
                            <td className="py-2 pr-4">
                              {row.volume_estimate ?? "—"}
                            </td>
                            <td className="py-2 pr-4">
                              {typeof row.cpc_estimate === "number" ? `$${row.cpc_estimate.toFixed(2)}` : "—"}
                            </td>
                            <td className="py-2 pr-4">
                              {row.badge ? (
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">{row.badge}</Badge>
                                  {row.reason && (
                                    <span className="text-xs text-muted-foreground">{row.reason}</span>
                                  )}
                                </div>
                              ) : "—"}
                            </td>
                            <td className="py-2 pr-4">
                              <Badge variant="secondary">{row.recommendation}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No metrics available yet.</div>
                )}
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
                  {competitors.map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-foreground line-clamp-1">{competitor.competitor_title}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{competitor.rating ?? "—"}</span>
                          </div>
                          {competitor.price != null && <span>Price: {competitor.price}</span>}
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
  )
}
