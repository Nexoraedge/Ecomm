"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Zap, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BugReport } from "@/components/bug-report"
import { getSupabaseBrowser } from "@/lib/supabase-browser"

export default function LoginPage() {
  const supabase = getSupabaseBrowser();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "")).replace(/\/$/, "");

  async function signInWithProvider(provider: "google" | "github") {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: appUrl ? `${appUrl}/dashboard` : undefined,
      },
    });
    if (error) setError(error.message);
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: appUrl ? `${appUrl}/dashboard` : undefined,
      },
    });
    if (error) setError(error.message);
    else setSent(true);
  }
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
              Welcome back
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Sign in to your SEO Boost account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Social Login */}
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full bg-transparent hover:bg-muted/50 transition-all duration-200"
                size="lg"
                onClick={() => signInWithProvider("google")}
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
                onClick={() => signInWithProvider("github")}
              >
                <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.85 3.14 8.96 7.49 10.41.55.1.75-.24.75-.53 0-.26-.01-1.12-.02-2.03-3.05.66-3.69-1.3-3.69-1.3-.5-1.28-1.23-1.62-1.23-1.62-1-.68.08-.67.08-.67 1.1.08 1.67 1.12 1.67 1.12.98 1.67 2.57 1.19 3.2.91.1-.71.38-1.19.69-1.46-2.44-.28-5-1.22-5-5.43 0-1.2.43-2.17 1.12-2.94-.11-.28-.49-1.42.1-2.95 0 0 .92-.3 3.02 1.12.88-.25 1.82-.37 2.75-.38.93.01 1.87.13 2.75.38 2.1-1.42 3.02-1.12 3.02-1.12.59 1.53.21 2.67.1 2.95.69.77 1.12 1.74 1.12 2.94 0 4.22-2.57 5.15-5.02 5.43.39.33.74.99.74 1.99 0 1.43-.01 2.59-.01 2.94 0 .29.2.64.75.53 4.35-1.45 7.49-5.56 7.49-10.41C23.02 5.24 18.27.5 12 .5z" />
                </svg>
                Continue with GitHub
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

            {/* Magic Link */}
            {sent ? (
              <p className="text-sm text-center">Magic link sent to <b>{email}</b>. Check your inbox.</p>
            ) : (
              <form className="space-y-6" onSubmit={sendMagicLink}>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-12 h-12 bg-muted/30 border-border focus:bg-background transition-colors"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Send magic link
                </Button>
              </form>
            )}

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-8 leading-relaxed">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="hover:underline text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:underline text-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>

      <BugReport />
    </div>
  )
}
