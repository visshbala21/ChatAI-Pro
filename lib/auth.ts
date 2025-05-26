import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { db } from "./db"
import { users } from "./db/schema"
import { eq } from "drizzle-orm"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          const user = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1)

          if (!user[0] || !user[0].hashedPassword) {
            console.log("User not found or no password set")
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user[0].hashedPassword)

          if (!isPasswordValid) {
            console.log("Invalid password")
            return null
          }

          return {
            id: user[0].id,
            email: user[0].email,
            name: user[0].name,
            image: user[0].image,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle OAuth users (Google, GitHub)
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          // Check if user exists in database
          const existingUser = await db.select().from(users).where(eq(users.email, user.email!)).limit(1)

          if (!existingUser[0]) {
            // Create new user in database
            await db.insert(users).values({
              email: user.email!,
              name: user.name || "",
              image: user.image || "",
              isActive: true,
              subscription: "free",
              apiUsage: 0,
              apiLimit: 100,
            })
            console.log("Created new OAuth user:", user.email)
          } else {
            console.log("OAuth user already exists:", user.email)
          }
        } catch (error) {
          console.error("Error handling OAuth user:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google" || account?.provider === "github") {
          // For OAuth users, get the database user ID by email
          try {
            const dbUser = await db.select().from(users).where(eq(users.email, user.email!)).limit(1)
            if (dbUser[0]) {
              token.id = dbUser[0].id
            }
          } catch (error) {
            console.error("Error fetching OAuth user:", error)
          }
        } else {
          // For credential users
          token.id = (user as any).id
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}
