import { pgTable, text, timestamp, uuid, integer, boolean, jsonb, index } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Users table - simplified for basic auth
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  hashedPassword: text("hashed_password"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  subscription: text("subscription", { enum: ["free", "pro", "enterprise"] })
    .default("free")
    .notNull(),
  apiUsage: integer("api_usage").default(0).notNull(),
  apiLimit: integer("api_limit").default(100).notNull(),
})

// Chat conversations table
export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    model: text("model").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
    isArchived: boolean("is_archived").default(false).notNull(),
  },
  (table) => ({
    userIdIdx: index("conversations_user_id_idx").on(table.userId),
    createdAtIdx: index("conversations_created_at_idx").on(table.createdAt),
  }),
)

// Chat messages table
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
    content: text("content").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    conversationIdIdx: index("messages_conversation_id_idx").on(table.conversationId),
    createdAtIdx: index("messages_created_at_idx").on(table.createdAt),
  }),
)

// Usage tracking table
export const usageTracking = pgTable(
  "usage_tracking",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    conversationId: uuid("conversation_id").references(() => conversations.id, { onDelete: "set null" }),
    model: text("model").notNull(),
    tokensUsed: integer("tokens_used").notNull(),
    cost: integer("cost"), // in cents
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("usage_tracking_user_id_idx").on(table.userId),
    createdAtIdx: index("usage_tracking_created_at_idx").on(table.createdAt),
  }),
)

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  conversations: many(conversations),
  usageTracking: many(usageTracking),
}))

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  messages: many(messages),
  usageTracking: many(usageTracking),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}))

export const usageTrackingRelations = relations(usageTracking, ({ one }) => ({
  user: one(users, {
    fields: [usageTracking.userId],
    references: [users.id],
  }),
  conversation: one(conversations, {
    fields: [usageTracking.conversationId],
    references: [conversations.id],
  }),
}))

// Export types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Conversation = typeof conversations.$inferSelect
export type NewConversation = typeof conversations.$inferInsert
export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert
export type UsageTracking = typeof usageTracking.$inferSelect
export type NewUsageTracking = typeof usageTracking.$inferInsert
