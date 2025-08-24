import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Zap, Mail, Lock, User, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { BugReport } from "@/components/bug-report"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home link */}
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <Card className="border-border shadow-2xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8 space-y-4">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Create your account
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Start optimizing your eCommerce listings today
            </CardDescription>
            <Badge variant="secondary" className="mt-2 px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              14-day free trial included
            </Badge>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Social Signup */}
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full bg-transparent hover:bg-muted/50 transition-all duration-200"
                size="lg"
              >
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent hover:bg-muted/50 transition-all duration-200"
                size="lg"
              >
                <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Continue with LinkedIn
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-muted-foreground font-medium">Or continue with email</span>
              </div>
            </div>

            {/* Registration Form */}
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      className="pl-12 h-12 bg-muted/30 border-border focus:bg-background transition-colors"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    className="h-12 bg-muted/30 border-border focus:bg-background transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-12 h-12 bg-muted/30 border-border focus:bg-background transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    className="pl-12 h-12 bg-muted/30 border-border focus:bg-background transition-colors"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">Must be at least 8 characters with letters and numbers</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-12 h-12 bg-muted/30 border-border focus:bg-background transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox id="terms" className="mt-1" />
                  <Label htmlFor="terms" className="text-sm font-normal leading-6">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox id="marketing" className="mt-1" />
                  <Label htmlFor="marketing" className="text-sm font-normal leading-6">
                    I'd like to receive marketing emails about SEO tips and product updates
                  </Label>
                </div>
              </div>

              <Link href="/dashboard">
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Create account
                </Button>
              </Link>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Free Trial Benefits */}
        <Card className="mt-8 border-border bg-muted/20 backdrop-blur-sm">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-4 text-center">Your free trial includes:</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-3 flex-shrink-0" />5 product analyses
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                AI-powered keyword research
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                Multi-platform optimization
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                Export to PDF/CSV
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <BugReport />
    </div>
  )
}
