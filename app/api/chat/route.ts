import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { conversations, messages, users, usageTracking } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import type { NextRequest } from "next/server"

export const maxDuration = 30

// AI Provider configurations
const getAIProvider = (model: string) => {
  const modelMap: Record<string, { provider: any; modelName: string }> = {
    "gpt-4": { provider: openai, modelName: "gpt-4" },
    "gpt-4-turbo": { provider: openai, modelName: "gpt-4-turbo" },
    "gpt-3.5-turbo": { provider: openai, modelName: "gpt-3.5-turbo" },
    "claude-3": { provider: openai, modelName: "gpt-4" }, // Fallback for demo
    "gemini-pro": { provider: openai, modelName: "gpt-4" }, // Fallback for demo
  }

  return modelMap[model] || modelMap["gpt-4"]
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { messages: chatMessages, model = "gpt-4", conversationId } = await req.json()

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
    const { provider, modelName } = getAIProvider(model)

    // Create system message based on model
    const systemMessage = `You are a helpful AI assistant powered by ${model}. You are knowledgeable, conversational, and helpful. Provide accurate and useful responses while being engaging and friendly.`

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
            tokensUsed,
            finishReason: event.finishReason,
          },
        })

        // Track usage
        await db.insert(usageTracking).values({
          userId: user.id,
          conversationId: conversation.id,
          model,
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
    return new Response("Internal server error", { status: 500 })
  }
}
