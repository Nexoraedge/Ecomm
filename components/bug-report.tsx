"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bug, X, Upload, Check } from "lucide-react"

export function BugReport() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    email: "",
    priority: "medium" as "low" | "medium" | "high",
  })
  const [screenshot, setScreenshot] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      // Optional: integrate screenshot upload to storage later; for now pass null URL
      const screenshotUrl = null as string | null
      const browserInfo = typeof navigator !== "undefined" ? navigator.userAgent : undefined

      const res = await fetch("/api/bugs/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category || undefined,
          priority: formData.priority,
          screenshotUrl: screenshotUrl || undefined,
          browserInfo,
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Failed to submit bug report")
      }
      setIsSubmitted(true)
      setTimeout(() => {
        setIsOpen(false)
        setIsSubmitted(false)
        setFormData({ title: "", description: "", category: "", email: "", priority: "medium" })
        setScreenshot(null)
      }, 1500)
    } catch (err: any) {
      setError(err?.message || "Unexpected error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0])
    }
  }

  if (isSubmitted) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-80 border-green-500/20 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">Report Submitted!</h3>
                <p className="text-sm text-green-600 dark:text-green-300">Thank you for your feedback.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {/* Floating Bug Report Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        size="icon"
      >
        <Bug className="h-6 w-6" />
      </Button>

      {/* Bug Report Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Bug className="h-5 w-5" />
                  <span>Report a Bug</span>
                </CardTitle>
                <CardDescription>Help us improve by reporting issues you encounter</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ui">UI/Design Issue</SelectItem>
                      <SelectItem value="functionality">Functionality Bug</SelectItem>
                      <SelectItem value="performance">Performance Issue</SelectItem>
                      <SelectItem value="data">Data/Content Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please describe the issue in detail, including steps to reproduce..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">We'll only use this to follow up on your report</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screenshot">Screenshot (Optional)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("screenshot")?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {screenshot ? screenshot.name : "Upload Screenshot"}
                    </Button>
                  </div>
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}

                <div className="flex space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
