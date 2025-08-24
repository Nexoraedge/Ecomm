"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  User,
  Bell,
  Key,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Shield,
  Globe,
  Mail,
  Smartphone,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [showApiKey, setShowApiKey] = useState(false)
  const [settings, setSettings] = useState({
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya@example.com",
    defaultPlatform: "amazon",
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    weeklyReports: true,
  })

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText("sk-1234567890abcdef1234567890abcdef")
    toast({
      title: "API key copied",
      description: "Your API key has been copied to clipboard.",
    })
  }

  const regenerateApiKey = () => {
    toast({
      title: "API key regenerated",
      description: "Your new API key is ready. Make sure to update your applications.",
    })
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="api">API Access</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal information and profile picture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile" />
                    <AvatarFallback className="text-lg">PS</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" className="bg-transparent">
                      Change Photo
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={settings.firstName}
                      onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={settings.lastName}
                      onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>

                {/* Password Change */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-lg font-medium text-foreground">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Platform Preferences
                </CardTitle>
                <CardDescription>Set your default platform and analysis preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultPlatform">Default Platform</Label>
                  <Select
                    value={settings.defaultPlatform}
                    onValueChange={(value) => setSettings({ ...settings, defaultPlatform: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amazon">Amazon</SelectItem>
                      <SelectItem value="flipkart">Flipkart</SelectItem>
                      <SelectItem value="meesho">Meesho</SelectItem>
                      <SelectItem value="myntra">Myntra</SelectItem>
                      <SelectItem value="ajio">Ajio</SelectItem>
                      <SelectItem value="nykaa">Nykaa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Choose how you want to be notified about your analyses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-base font-medium">Email Notifications</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">Get notified when analyses are complete</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-base font-medium">Push Notifications</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive tips, updates, and promotional content</p>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => setSettings({ ...settings, marketingEmails: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Get weekly summaries of your SEO performance</p>
                    </div>
                    <Switch
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Access */}
          <TabsContent value="api" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys
                </CardTitle>
                <CardDescription>Manage your API keys for programmatic access to SEO Boost</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">Production API Key</h4>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 font-mono text-sm bg-background border border-border rounded px-3 py-2">
                      {showApiKey ? "sk-1234567890abcdef1234567890abcdef" : "sk-••••••••••••••••••••••••••••••••"}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="bg-transparent"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyApiKey} className="bg-transparent">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Created on Jan 15, 2024 • Last used 2 hours ago</p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={regenerateApiKey} className="bg-transparent">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate Key
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    View Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>Monitor your API usage and limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-border rounded-lg">
                    <div className="text-2xl font-bold text-foreground">1,247</div>
                    <p className="text-sm text-muted-foreground">Requests this month</p>
                  </div>
                  <div className="text-center p-4 border border-border rounded-lg">
                    <div className="text-2xl font-bold text-foreground">∞</div>
                    <p className="text-sm text-muted-foreground">Monthly limit</p>
                  </div>
                  <div className="text-center p-4 border border-border rounded-lg">
                    <div className="text-2xl font-bold text-foreground">99.9%</div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account */}
          <TabsContent value="account" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Security
                </CardTitle>
                <CardDescription>Manage your account security and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" className="bg-transparent">
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Login Sessions</h4>
                      <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
                    </div>
                    <Button variant="outline" className="bg-transparent">
                      View Sessions
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Export Data</h4>
                      <p className="text-sm text-muted-foreground">Download all your account data</p>
                    </div>
                    <Button variant="outline" className="bg-transparent">
                      Request Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible actions that will affect your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
