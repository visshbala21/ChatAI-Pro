import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { logEnvironmentStatus } from "@/lib/env-validation"

const inter = Inter({ subsets: ["latin"] })

// Log environment status on startup
if (typeof window === "undefined") {
  logEnvironmentStatus()
}

export const metadata: Metadata = {
  title: "ChatAI Pro - Advanced AI Chat Platform",
  description: "Chat with multiple AI models including GPT-4, Claude, and Gemini in one powerful platform.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
