import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { conversations, messages, users, usageTracking } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import type { NextRequest } from "next/server"

export const maxDuration = 30

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is not configured")
}

// AI Provider configurations
const getAIProvider = (model: string) => {
  const modelMap: Record<string, { provider: any; modelName: string; isAvailable: boolean }> = {
    "gpt-4": { provider: openai, modelName: "gpt-4", isAvailable: !!process.env.OPENAI_API_KEY },
    "gpt-4-turbo": { provider: openai, modelName: "gpt-4-turbo", isAvailable: !!process.env.OPENAI_API_KEY },
    "gpt-3.5-turbo": { provider: openai, modelName: "gpt-3.5-turbo", isAvailable: !!process.env.OPENAI_API_KEY },
    "claude-3": { provider: openai, modelName: "gpt-4", isAvailable: false }, // Fallback for demo
    "gemini-pro": { provider: openai, modelName: "gpt-4", isAvailable: false }, // Fallback for demo
  }

  return modelMap[model] || modelMap["gpt-4"]
}

export async function POST(req: NextRequest) {
  try {
    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured")
      return new Response("OpenAI API key not configured", { status: 500 })
    }

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { messages: chatMessages, model = "gpt-4", conversationId } = await req.json()

    if (!chatMessages || !Array.isArray(chatMessages) || chatMessages.length === 0) {
      return new Response("Invalid messages format", { status: 400 })
    }

    // Get user data
    const userData = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)

    if (!userData[0]) {
      return new Response("User not found", { status: 404 })
    }

    const user = userData[0]

    // Check API usage limits
    if (user.apiUsage >= user.apiLimit) {
      return new Response("API usage limit exceeded", { status: 429 })
    }

    // Get or create conversation
    let conversation
    if (conversationId) {
      const existingConversation = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, conversationId))
        .limit(1)

      conversation = existingConversation[0]
    } else {
      // Create new conversation
      const newConversation = await db
        .insert(conversations)
        .values({
          userId: user.id,
          title: chatMessages[0]?.content?.slice(0, 50) || "New Chat",
          model,
        })
        .returning()

      conversation = newConversation[0]
    }

    // Get AI provider configuration
    const { provider, modelName, isAvailable } = getAIProvider(model)

    // Create system message based on model
    let systemMessage = `You are a helpful AI assistant powered by ${model}. You are knowledgeable, conversational, and helpful. Provide accurate and useful responses while being engaging and friendly.`

    // Add special instructions for placeholder models
    if (!isAvailable && (model === "claude-3" || model === "gemini-pro")) {
      systemMessage += ` Note: You are currently running on OpenAI's GPT-4 as a fallback since ${model} integration is not yet available.`
    }

    // Stream the AI response
    const result = streamText({
      model: provider(modelName),
      messages: [{ role: "system", content: systemMessage }, ...chatMessages],
      temperature: 0.7,
      maxTokens: 2048,
    })

    // Save user message to database
    await db.insert(messages).values({
      conversationId: conversation.id,
      role: "user",
      content: chatMessages[chatMessages.length - 1].content,
    })

    // Track the response and save assistant message
    const stream = result.toDataStreamResponse({
      onFinish: async (event) => {
        const assistantMessage = event.text || ""
        const tokensUsed = event.usage?.totalTokens || 0

        // Save assistant message
        await db.insert(messages).values({
          conversationId: conversation.id,
          role: "assistant",
          content: assistantMessage,
          metadata: {
            model,
            actualModel: modelName, // Track what model was actually used
            tokensUsed,
            finishReason: event.finishReason,
            isPlaceholder: !isAvailable,
          },
        })

        // Track usage
        await db.insert(usageTracking).values({
          userId: user.id,
          conversationId: conversation.id,
          model: `${model}${!isAvailable ? ` (via ${modelName})` : ""}`,
          tokensUsed,
          cost: Math.ceil(tokensUsed * 0.002), // Rough cost calculation in cents
        })

        // Update user API usage
        await db
          .update(users)
          .set({
            apiUsage: user.apiUsage + 1,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id))

        // Update conversation timestamp
        await db.update(conversations).set({ updatedAt: new Date() }).where(eq(conversations.id, conversation.id))
      },
    })

    return stream
  } catch (error) {
    console.error("Chat API error:", error)

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return new Response("Invalid API key", { status: 401 })
      }
      if (error.message.includes("quota")) {
        return new Response("API quota exceeded", { status: 429 })
      }
    }

    return new Response("Internal server error", { status: 500 })
  }
}
