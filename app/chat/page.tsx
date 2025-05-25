"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bot, User, Send, Settings, Menu, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"

const AI_MODELS = [
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI", badge: "Most Popular" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI", badge: "Fast" },
  { id: "claude-3", name: "Claude 3", provider: "Anthropic", badge: "Creative" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google", badge: "Analytical" },
]

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedModel, setSelectedModel] = useState("gpt-4")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { model: selectedModel },
  })

  const currentModel = AI_MODELS.find((model) => model.id === selectedModel)

  // Show loading spinner while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!session) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-gray-900">ChatAI Pro</span>
          </Link>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            ×
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">AI Model</h3>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-gray-500">{model.provider}</div>
                      </div>
                      {model.badge && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {model.badge}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/pricing">
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade
              </Link>
            </Button>
          </div>

          <Separator />

          <div className="text-xs text-gray-500 p-2">Signed in as {session.user?.email}</div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-gray-900">Chat with {currentModel?.name}</h1>
              <p className="text-sm text-gray-500">Powered by {currentModel?.provider}</p>
            </div>
          </div>
          <Badge variant="outline">{currentModel?.badge}</Badge>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bot className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
                  <p className="text-gray-500 text-center max-w-sm">
                    Ask me anything! I'm powered by {currentModel?.name} and ready to help.
                  </p>
                </CardContent>
              </Card>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`flex-shrink-0 ${message.role === "user" ? "ml-3" : "mr-3"}`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-white border shadow-sm"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex">
                  <div className="mr-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="bg-white border shadow-sm rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t bg-white p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={`Message ${currentModel?.name}...`}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
