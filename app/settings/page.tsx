"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Bot, ArrowLeft, Palette, MessageSquare, Bell, User } from "lucide-react"

export default function SettingsPage() {
  const [theme, setTheme] = useState("light")
  const [fontSize, setFontSize] = useState([14])
  const [notifications, setNotifications] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [streamingEnabled, setStreamingEnabled] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/chat">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chat
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-gray-900">ChatAI Pro Settings</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-blue-600" />
                <CardTitle>Appearance</CardTitle>
              </div>
              <CardDescription>Customize the look and feel of your chat interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size: {fontSize[0]}px</Label>
                <Slider value={fontSize} onValueChange={setFontSize} max={20} min={12} step={1} className="w-full" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="w-full h-8 bg-blue-600 rounded mb-2"></div>
                  <div className="text-xs text-center">Blue</div>
                </div>
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="w-full h-8 bg-green-600 rounded mb-2"></div>
                  <div className="text-xs text-center">Green</div>
                </div>
                <div className="p-4 border rounded-lg bg-purple-50 border-purple-200">
                  <div className="w-full h-8 bg-purple-600 rounded mb-2"></div>
                  <div className="text-xs text-center">Purple</div>
                </div>
                <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                  <div className="w-full h-8 bg-orange-600 rounded mb-2"></div>
                  <div className="text-xs text-center">Orange</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <CardTitle>Chat Preferences</CardTitle>
              </div>
              <CardDescription>Configure how your chat experience works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="streaming">Enable Streaming</Label>
                  <p className="text-sm text-gray-500">Show AI responses as they're being generated</p>
                </div>
                <Switch id="streaming" checked={streamingEnabled} onCheckedChange={setStreamingEnabled} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save">Auto-save Conversations</Label>
                  <p className="text-sm text-gray-500">Automatically save your chat history</p>
                </div>
                <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="default-model">Default AI Model</Label>
                <Select defaultValue="gpt-4">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-yellow-600" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications for new messages</p>
                </div>
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sound">Sound Effects</Label>
                  <p className="text-sm text-gray-500">Play sounds for message notifications</p>
                </div>
                <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-purple-600" />
                <CardTitle>Account</CardTitle>
              </div>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Export Data</h4>
                  <p className="text-sm text-gray-500">Download all your conversations</p>
                </div>
                <Button variant="outline">Export</Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-gray-500">Permanently delete your account and data</p>
                </div>
                <Button variant="destructive">Delete</Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" asChild>
              <Link href="/chat">Cancel</Link>
            </Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
