import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to login link */}
        <Link
          href="/login"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to login
        </Link>

        <Card className="border-border shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
            <CardDescription className="text-base">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="Enter your email" className="pl-10" required />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Send reset link
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
