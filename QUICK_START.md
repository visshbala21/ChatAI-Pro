# 🚀 ChatAI Pro - Quick Start Guide

## What You Need

1. **OpenAI API Key** (Required) - Get from [platform.openai.com](https://platform.openai.com)
2. **Database** (Required) - Use [Neon](https://neon.tech) (free) or local PostgreSQL
3. **NextAuth Secret** (Required) - Generate a random string

## Setup Steps

### 1. Install Dependencies
\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

### 2. Environment Setup
Copy `.env.example` to `.env.local` and update these values:

\`\`\`env
# Replace with your actual values
DATABASE_URL="your-neon-or-postgres-connection-string"
NEXTAUTH_SECRET="your-generated-secret-key"
OPENAI_API_KEY="sk-your-openai-api-key"
\`\`\`

### 3. Database Setup
\`\`\`bash
npm run db:generate
npm run db:migrate
\`\`\`

### 4. Start Development
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## Getting Your Values

### OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up/login
3. Go to API Keys
4. Create new secret key
5. Copy the key (starts with `sk-`)

### Database (Neon - Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Sign up for free
3. Create new project
4. Copy connection string from dashboard

### NextAuth Secret
Run this command to generate:
\`\`\`bash
openssl rand -base64 32
\`\`\`

## Test Your Setup

1. ✅ Visit homepage at [localhost:3000](http://localhost:3000)
2. ✅ Create account at `/login`
3. ✅ Test chat at `/chat`
4. ✅ Send a message to AI

## Troubleshooting

**"OpenAI API key not configured"**
- Make sure you replaced the placeholder with your real API key

**Database connection errors**
- Verify your DATABASE_URL is correct
- For Neon, make sure to include `?sslmode=require`

**Build errors**
- Try: `rm -rf node_modules package-lock.json && npm install --legacy-peer-deps`

## What's Working

✅ **OpenAI Models**: GPT-4, GPT-3.5 Turbo
✅ **Authentication**: Email/password signup and login
✅ **Chat Interface**: Real-time streaming responses
✅ **Conversation History**: Persistent chat storage
✅ **Responsive Design**: Works on desktop and mobile

## What's Coming Soon

🔄 **Claude Models**: Anthropic AI (placeholder - uses GPT-4)
🔄 **Gemini Models**: Google AI (placeholder - uses GPT-4)
🔄 **OAuth Login**: GitHub and Google (optional)

## Need Help?

Check the detailed `SETUP_GUIDE.md` for more information or create an issue if you're stuck.

Happy chatting! 🤖
