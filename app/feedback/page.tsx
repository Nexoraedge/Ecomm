"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Star,
  Send,
  MessageCircle,
  HelpCircle,
  ThumbsUp,
  Upload,
  Mail,
  Phone,
  Clock,
  Zap,
  ArrowLeft,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const faqs = [
  {
    question: "How accurate are the SEO optimizations?",
    answer:
      "Our AI analyzes millions of successful product listings and uses advanced algorithms to generate optimizations. On average, users see a 30-40% improvement in search rankings within 2-4 weeks of implementing our suggestions.",
  },
  {
    question: "Which eCommerce platforms do you support?",
    answer:
      "We currently support Amazon, Flipkart, Meesho, Myntra, Ajio, and Nykaa. We're constantly adding new platforms based on user demand. If you need support for a specific platform, please let us know through our feedback form.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time from your billing settings. Your account will remain active until the end of your current billing period, and you'll retain access to all your previous analyses.",
  },
  {
    question: "How long does an analysis take?",
    answer:
      "Most analyses complete within 2-3 minutes. Complex products with many competitors might take up to 5 minutes. You'll receive real-time updates during the process and can cancel at any time.",
  },
  {
    question: "Do you offer API access?",
    answer:
      "Yes, Pro and Enterprise plans include full API access. You can integrate our SEO optimization directly into your existing workflows and tools. Check our API documentation for implementation details.",
  },
  {
    question: "Is my product data secure?",
    answer:
      "Absolutely. We use enterprise-grade encryption and never share your product data with third parties. Your analyses are private and only accessible to you. We're SOC 2 compliant and follow strict data protection standards.",
  },
]

const featureRequests = [
  { id: 1, title: "Bulk analysis for multiple products", votes: 47, status: "In Progress" },
  { id: 2, title: "Integration with Shopify", votes: 32, status: "Planned" },
  { id: 3, title: "A/B testing for product titles", votes: 28, status: "Under Review" },
  { id: 4, title: "Competitor price tracking", votes: 23, status: "Planned" },
  { id: 5, title: "Mobile app for iOS and Android", votes: 19, status: "Under Review" },
]

export default function FeedbackPage() {
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState({
    category: "",
    subject: "",
    message: "",
  })

  const handleSubmitFeedback = () => {
    if (!feedback.category || !feedback.subject || !feedback.message || rating === 0) {
      toast({
        title: "Please complete all fields",
        description: "Rating, category, subject, and message are required.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback! We'll review it and get back to you soon.",
    })

    // Reset form
    setRating(0)
    setFeedback({ category: "", subject: "", message: "" })
  }

  const handleVote = (requestId: number) => {
    toast({
      title: "Vote recorded",
      description: "Thanks for voting! We'll prioritize features based on community feedback.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SEO Boost</span>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
            <p className="text-muted-foreground mt-2">
              Get help, share feedback, or request new features to improve SEO Boost
            </p>
          </div>

          <Tabs defaultValue="feedback" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            {/* Feedback Tab */}
            <TabsContent value="feedback" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Feedback Form */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Share Your Feedback
                    </CardTitle>
                    <CardDescription>Help us improve SEO Boost with your suggestions and reports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Rating */}
                    <div className="space-y-2">
                      <Label>Overall Rating</Label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="p-1"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= (hoveredRating || rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {rating > 0 && `${rating} star${rating !== 1 ? "s" : ""}`}
                        </span>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={feedback.category}
                        onValueChange={(value) => setFeedback({ ...feedback, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select feedback category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="improvement">Improvement Suggestion</SelectItem>
                          <SelectItem value="general">General Feedback</SelectItem>
                          <SelectItem value="billing">Billing Issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your feedback"
                        value={feedback.subject}
                        onChange={(e) => setFeedback({ ...feedback, subject: e.target.value })}
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Detailed Feedback</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide detailed information about your feedback, including steps to reproduce any issues..."
                        rows={5}
                        value={feedback.message}
                        onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                      />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label>Attachments (Optional)</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Drop files here or click to upload screenshots</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                      </div>
                    </div>

                    <Button onClick={handleSubmitFeedback} className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </Button>
                  </CardContent>
                </Card>

                {/* Feature Requests */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Feature Requests</CardTitle>
                    <CardDescription>Vote on features you'd like to see next</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {featureRequests.map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground mb-1">{request.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  request.status === "In Progress"
                                    ? "default"
                                    : request.status === "Planned"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {request.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{request.votes} votes</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVote(request.id)}
                            className="bg-transparent"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Vote
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>Find answers to common questions about SEO Boost</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Support
                    </CardTitle>
                    <CardDescription>Get help via email for detailed issues</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">support@seoboost.com</p>
                      <p className="text-sm text-muted-foreground">
                        We typically respond within 24 hours during business days
                      </p>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Live Chat
                    </CardTitle>
                    <CardDescription>Chat with our support team in real-time</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">Online now</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Average response time: 2-3 minutes</p>
                    <Button className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Phone Support
                    </CardTitle>
                    <CardDescription>Speak directly with our support team</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">+1 (555) 123-4567</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Mon-Fri, 9 AM - 6 PM EST</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Enterprise Support</CardTitle>
                    <CardDescription>Dedicated support for Enterprise customers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                        <span>Dedicated account manager</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                        <span>Priority phone support</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                        <span>Custom integration help</span>
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full bg-transparent">
                      Contact Sales
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
