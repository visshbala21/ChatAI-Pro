// Database connection test utility
import { db } from "./index"
import { users } from "./schema"

export async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing database connection...")

    // Try a simple query
    const result = await db.select().from(users).limit(1)

    console.log("✅ Database connection successful")
    console.log(`📊 Database contains ${result.length > 0 ? "existing" : "no"} users`)

    return { success: true, hasUsers: result.length > 0 }
  } catch (error) {
    console.error("❌ Database connection failed:", error)

    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        console.error("💡 Tip: Make sure PostgreSQL is running on your system")
      } else if (error.message.includes("authentication failed")) {
        console.error("💡 Tip: Check your database credentials in DATABASE_URL")
      } else if (error.message.includes("database") && error.message.includes("does not exist")) {
        console.error("💡 Tip: Create the database first: createdb chatai_pro")
      }
    }

    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
