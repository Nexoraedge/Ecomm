import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, Eye, Cookie, Database, Globe } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/Logo.png" alt="Logo" width={32} height={32} className="rounded" />
              <span className="text-xl font-bold text-foreground">SEO Boost</span>
            </Link>
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Learn how we collect, use, and protect your personal information
            </p>
            <Badge variant="secondary">Last updated: August 24, 2025</Badge>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  At SEO Boost, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                  disclose, and safeguard your information when you use our eCommerce SEO optimization service. Please
                  read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please
                  do not access the application.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Information We Collect
                </CardTitle>
                <CardDescription>Types of data we collect and how we collect it</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>• Name and email address when you create an account</li>
                      <li>• Payment information for subscription processing</li>
                      <li>• Profile information you choose to provide</li>
                      <li>• Communication preferences and settings</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Product Data</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>• Product names, descriptions, and specifications you submit for analysis</li>
                      <li>• Category selections and platform preferences</li>
                      <li>• Analysis results and optimization suggestions</li>
                      <li>• Usage patterns and feature interactions</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Technical Information</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>• IP address, browser type, and device information</li>
                      <li>• Log data including access times and pages viewed</li>
                      <li>• Cookies and similar tracking technologies</li>
                      <li>• API usage statistics and performance metrics</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  How We Use Your Information
                </CardTitle>
                <CardDescription>The purposes for which we process your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Service Provision</h4>
                      <p className="text-sm text-muted-foreground">
                        Process your product data to generate SEO optimizations and competitor analysis
                      </p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Account Management</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage your account, process payments, and provide customer support
                      </p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Communication</h4>
                      <p className="text-sm text-muted-foreground">
                        Send you service updates, analysis results, and marketing communications (with consent)
                      </p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Improvement</h4>
                      <p className="text-sm text-muted-foreground">
                        Analyze usage patterns to improve our AI algorithms and user experience
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Information Sharing and Disclosure
                </CardTitle>
                <CardDescription>When and how we share your information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">What We Don&apos;t Share</h4>
                  <p className="text-sm text-green-700">
                    We never sell, rent, or trade your personal information or product data to third parties for
                    marketing purposes.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Limited Sharing Scenarios:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                    <li>• Service providers who help us operate our platform (with strict confidentiality agreements)</li>
                    <li>• Legal compliance when required by law or to protect our rights</li>
                    <li>• Business transfers (with notice and continued privacy protection)</li>
                    <li>• Aggregated, anonymized data for research and improvement purposes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5" />
                  Cookies and Tracking
                </CardTitle>
                <CardDescription>How we use cookies and similar technologies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Essential Cookies</h4>
                    <p className="text-sm text-muted-foreground">Required for basic site functionality and security</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Analytics Cookies</h4>
                    <p className="text-sm text-muted-foreground">Help us understand how you use our service</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Preference Cookies</h4>
                    <p className="text-sm text-muted-foreground">Remember your settings and preferences</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  You can control cookie preferences through your browser settings. Note that disabling certain cookies
                  may affect site functionality.
                </p>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Your Privacy Rights</CardTitle>
                <CardDescription>Control over your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Access & Control</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• View and update your personal information</li>
                      <li>• Download your data in a portable format</li>
                      <li>• Delete your account and associated data</li>
                      <li>• Opt-out of marketing communications</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Data Protection</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Request correction of inaccurate data</li>
                      <li>• Restrict processing of your information</li>
                      <li>• Object to certain data processing</li>
                      <li>• File complaints with supervisory authorities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
                <CardDescription>How we protect your information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Encryption</h4>
                    <p className="text-sm text-muted-foreground">
                      All data is encrypted in transit and at rest using industry-standard protocols
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Access Controls</h4>
                    <p className="text-sm text-muted-foreground">
                      Role-based access and strict least-privilege policies safeguard your data
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Monitoring</h4>
                    <p className="text-sm text-muted-foreground">Continuous monitoring and audit logging</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Backups</h4>
                    <p className="text-sm text-muted-foreground">Automated backups with periodic recovery testing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>Questions about this policy</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  If you have any questions or requests regarding this Privacy Policy, contact us at
                  <span className="font-medium text-foreground"> support@nexoraedge.com</span>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    )
  }
