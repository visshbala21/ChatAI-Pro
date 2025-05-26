// Environment variable validation utility
export function validateEnvironment() {
  const errors: string[] = []
  const warnings: string[] = []

  // Required variables
  if (!process.env.DATABASE_URL) {
    errors.push("DATABASE_URL is required")
  }

  if (!process.env.NEXTAUTH_SECRET) {
    errors.push("NEXTAUTH_SECRET is required")
  }

  if (!process.env.NEXTAUTH_URL) {
    errors.push("NEXTAUTH_URL is required")
  }

  if (!process.env.OPENAI_API_KEY) {
    errors.push("OPENAI_API_KEY is required for AI functionality")
  }

  // Optional but recommended
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes("your-anthropic")) {
    warnings.push("ANTHROPIC_API_KEY not configured - Claude models will use OpenAI fallback")
  }

  if (!process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY.includes("your-google")) {
    warnings.push("GOOGLE_AI_API_KEY not configured - Gemini models will use OpenAI fallback")
  }

  // OAuth (optional)
  const hasGitHubOAuth = process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
  const hasGoogleOAuth = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET

  if (!hasGitHubOAuth) {
    warnings.push("GitHub OAuth not configured - GitHub login will be unavailable")
  }

  if (!hasGoogleOAuth) {
    warnings.push("Google OAuth not configured - Google login will be unavailable")
  }

  // Database URL validation
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("postgresql://")) {
    errors.push("DATABASE_URL must be a valid PostgreSQL connection string")
  }

  // OpenAI API key validation
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith("sk-")) {
    errors.push("OPENAI_API_KEY must start with 'sk-'")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    hasGitHubOAuth,
    hasGoogleOAuth,
    hasAnthropicAPI: !!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes("your-anthropic"),
    hasGoogleAI: !!process.env.GOOGLE_AI_API_KEY && !process.env.GOOGLE_AI_API_KEY.includes("your-google"),
  }
}

// Log environment status on startup
export function logEnvironmentStatus() {
  const validation = validateEnvironment()

  console.log("🔧 Environment Configuration Status:")
  console.log("=====================================")

  if (validation.isValid) {
    console.log("✅ All required environment variables are configured")
  } else {
    console.log("❌ Missing required environment variables:")
    validation.errors.forEach((error) => console.log(`   - ${error}`))
  }

  if (validation.warnings.length > 0) {
    console.log("\n⚠️  Warnings:")
    validation.warnings.forEach((warning) => console.log(`   - ${warning}`))
  }

  console.log("\n🔌 Available Features:")
  console.log(`   - OpenAI Models: ${process.env.OPENAI_API_KEY ? "✅" : "❌"}`)
  console.log(`   - GitHub OAuth: ${validation.hasGitHubOAuth ? "✅" : "❌"}`)
  console.log(`   - Google OAuth: ${validation.hasGoogleOAuth ? "✅" : "❌"}`)
  console.log(`   - Anthropic API: ${validation.hasAnthropicAPI ? "✅" : "❌ (using OpenAI fallback)"}`)
  console.log(`   - Google AI API: ${validation.hasGoogleAI ? "✅" : "❌ (using OpenAI fallback)"}`)

  console.log("=====================================\n")

  return validation
}
