import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { conversations, messages } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userConversations = await db
      .select({
        id: conversations.id,
        title: conversations.title,
        model: conversations.model,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        isArchived: conversations.isArchived,
      })
      .from(conversations)
      .where(eq(conversations.userId, session.user.id))
      .orderBy(desc(conversations.updatedAt))

    return NextResponse.json({ conversations: userConversations })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, model = "gpt-4" } = await req.json()

    const newConversation = await db
      .insert(conversations)
      .values({
        userId: session.user.id,
        title: title || "New Chat",
        model,
      })
      .returning()

    return NextResponse.json({ conversation: newConversation[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
