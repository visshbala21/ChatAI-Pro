import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, model = "gpt-4" } = await req.json()

  // Map model IDs to actual model names
  const modelMap: Record<string, string> = {
    "gpt-4": "gpt-4",
    "gpt-3.5-turbo": "gpt-3.5-turbo",
    "claude-3": "gpt-4", // Fallback to GPT-4 for demo
    "gemini-pro": "gpt-4", // Fallback to GPT-4 for demo
  }

  const result = streamText({
    model: openai(modelMap[model] || "gpt-4"),
    messages,
    system: `You are a helpful AI assistant. You are currently running as ${model}. Be conversational and helpful.`,
  })

  return result.toDataStreamResponse()
}
