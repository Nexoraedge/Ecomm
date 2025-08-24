"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { getSupabaseBrowser } from "@/lib/supabase-browser"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Zap,
  Target,
  BarChart3,
  Clock,
  CheckCircle,
  X,
  ArrowRight,
  Sparkles,
  Globe,
  TrendingUp,
} from "lucide-react"

const platforms = [
  { id: "amazon", name: "Amazon", icon: "🛒" },
  { id: "flipkart", name: "Flipkart", icon: "🛍️" },
  { id: "meesho", name: "Meesho", icon: "📱" },
  { id: "myntra", name: "Myntra", icon: "👕" },
  { id: "ajio", name: "Ajio", icon: "👗" },
  { id: "nykaa", name: "Nykaa", icon: "💄" },
]

const categories = [
  "Electronics & Gadgets",
  "Fashion & Apparel",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Fitness",
  "Books & Media",
  "Toys & Games",
  "Automotive",
  "Health & Wellness",
  "Jewelry & Accessories",
]

const scanningSteps = [
  { id: 1, title: "Analyzing product details", description: "Processing your product information" },
  { id: 2, title: "Scanning competitors", description: "Finding top 20 competitors in your category" },
  { id: 3, title: "Extracting keywords", description: "Identifying high-performing keywords" },
  { id: 4, title: "Analyzing trends", description: "Discovering trending tags and phrases" },
  { id: 5, title: "Generating content", description: "Creating optimized titles and descriptions" },
]

export default function AnalyzePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isScanning, setIsScanning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [analysisId, setAnalysisId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    features: "",
    category: "",
    targetKeywords: "",
  })

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
    )
  }

  const handleStartAnalysis = async () => {
    if (isScanning) return

    // Ensure exactly one supported platform is selected for backend
    const supported = ["amazon", "flipkart", "meesho"] as const
    const chosen = selectedPlatforms.find((p): p is typeof supported[number] => (supported as readonly string[]).includes(p))
    if (!chosen) {
      toast({ title: "Select a supported platform", description: "Choose Amazon, Flipkart, or Meesho.", variant: "destructive" })
      return
    }

    // Auth check
    const supabase = getSupabaseBrowser()
    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user) {
      router.push("/login")
      return
    }

    try {
      setIsScanning(true)
      setCurrentStep(0)
      setProgress(0)

      // Ensure server-side user profile exists (auto-provision)
      try {
        const u = await fetch("/api/auth/user", { cache: "no-store" })
        if (u.status === 401) {
          router.push("/login")
          return
        }
      } catch {}

      // Kick off create analysis
      const res = await fetch("/api/analysis/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: formData.productName,
          productDescription: formData.description,
          productFeatures: formData.features,
          category: formData.category,
          targetPlatform: chosen,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to start analysis")
      }
      const payload = await res.json()
      const id: string | undefined = payload?.id || payload?.analysisId || payload?.analysis?.id
      if (!id) throw new Error("Invalid response from server")
      setAnalysisId(id)

      // Start progress animation (visual only)
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * 10 + 4
          // Cap at 95% until completion flips it to 100
          const cap = 95
          const next = Math.min(prev + increment, cap)
          const stepIdx = Math.min(
            Math.floor((next / 100) * scanningSteps.length),
            scanningSteps.length - 1,
          )
          setCurrentStep(stepIdx)
          return next
        })
      }, 900)

      // Start polling backend for status
      const poll = async () => {
        if (!id) return
        const r = await fetch(`/api/analysis/status/${id}`)
        if (r.status === 401) {
          router.push("/login")
          return
        }
        if (!r.ok) return
        const j = await r.json()
        if (j?.status === "completed") {
          // Stop timers
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          if (pollRef.current) {
            clearInterval(pollRef.current)
            pollRef.current = null
          }
          setProgress(100)
          setCurrentStep(scanningSteps.length)
          setIsScanning(false)
          router.push(`/dashboard/results/${id}`)
        }
      }
      // Immediate check then interval
      await poll()
      pollRef.current = setInterval(poll, 2000)
    } catch (e: unknown) {
      console.error(e)
      const msg = e instanceof Error ? e.message : "Unexpected error"
      toast({ title: "Failed to start analysis", description: msg, variant: "destructive" })
      // Cleanup
      setIsScanning(false)
      setProgress(0)
      setCurrentStep(0)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }

  const handleCancelScan = () => {
    setIsScanning(false)
    setProgress(0)
    setCurrentStep(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }, [])

  if (isScanning || progress === 100) {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {progress === 100 ? "Analysis Complete!" : "Analyzing Your Product"}
            </h1>
            <p className="text-muted-foreground">
              {progress === 100 ? "Your SEO optimization is ready" : "Our AI is working hard to optimize your listing"}
            </p>
          </div>

          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {formData.productName || "Product Analysis"}
                  </CardTitle>
                  <CardDescription>
                    Platform: {selectedPlatforms.map((id) => platforms.find((p) => p.id === id)?.name).join(", ")}
                  </CardDescription>
                </div>
                {isScanning && (
                  <Button variant="outline" size="sm" onClick={handleCancelScan}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              {/* Scanning Steps */}
              <div className="space-y-4">
                {scanningSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      index <= currentStep ? "border-primary/20 bg-primary/5" : "border-border bg-muted/30"
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        index < currentStep
                          ? "bg-primary text-primary-foreground"
                          : index === currentStep
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : index === currentStep ? (
                        <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                      ) : (
                        <span className="text-sm font-medium">{step.id}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    {index <= currentStep && (
                      <Badge variant={index < currentStep ? "default" : "secondary"}>
                        {index < currentStep ? "Complete" : "In Progress"}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              {progress === 100 && analysisId && (
                <div className="text-center pt-4">
                  <Button size="lg" onClick={() => router.push(`/dashboard/results/${analysisId}`)}>
                    View Results
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Stats During Scanning */}
          {isScanning && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Search className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">127</div>
                      <p className="text-sm text-muted-foreground">Keywords Found</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">20</div>
                      <p className="text-sm text-muted-foreground">Competitors Analyzed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">+34%</div>
                      <p className="text-sm text-muted-foreground">Expected Boost</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
    )
  }

  return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">New Product Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Enter your product details and let our AI optimize your listing for maximum visibility
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Product Information
                </CardTitle>
                <CardDescription>Provide details about your product for accurate optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    placeholder="e.g., Wireless Bluetooth Headphones with Noise Cancellation"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Product Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product's main features, benefits, and use cases..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Key Features & Specifications</Label>
                  <Textarea
                    id="features"
                    placeholder="List key features, specifications, dimensions, materials, etc..."
                    rows={3}
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetKeywords">Target Keywords (Optional)</Label>
                  <Input
                    id="targetKeywords"
                    placeholder="e.g., wireless headphones, bluetooth, noise cancelling"
                    value={formData.targetKeywords}
                    onChange={(e) => setFormData({ ...formData, targetKeywords: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate keywords with commas. Leave blank for AI to discover keywords automatically.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Platform Selection */}
            <Card className="border-border mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Target Platforms
                </CardTitle>
                <CardDescription>Select the eCommerce platforms you want to optimize for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {platforms.map((platform) => (
                    <div
                      key={platform.id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedPlatforms.includes(platform.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/30"
                      }`}
                      onClick={() => handlePlatformToggle(platform.id)}
                    >
                      <Checkbox
                        checked={selectedPlatforms.includes(platform.id)}
                        onCheckedChange={() => handlePlatformToggle(platform.id)}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{platform.icon}</span>
                        <span className="font-medium">{platform.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analysis Preview */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Analysis Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Product Name</span>
                    <Badge variant={formData.productName ? "default" : "secondary"}>
                      {formData.productName ? "Ready" : "Required"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Category</span>
                    <Badge variant={formData.category ? "default" : "secondary"}>
                      {formData.category ? "Selected" : "Required"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Platforms</span>
                    <Badge variant={selectedPlatforms.length > 0 ? "default" : "secondary"}>
                      {selectedPlatforms.length > 0 ? `${selectedPlatforms.length} selected` : "None"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Description</span>
                    <Badge variant={formData.description ? "default" : "secondary"}>
                      {formData.description ? "Added" : "Optional"}
                    </Badge>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleStartAnalysis}
                  disabled={!formData.productName || !formData.category || selectedPlatforms.length === 0}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Start Analysis
                </Button>
              </CardContent>
            </Card>

            {/* What You'll Get */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">What You\u0026apos;ll Get</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>SEO-optimized product titles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Enhanced product descriptions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>High-converting keywords</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Competitor analysis insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Trending tags & phrases</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Export-ready content</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Estimated Time */}
            <Card className="border-border bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Estimated Time</p>
                    <p className="text-sm text-muted-foreground">2-3 minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
