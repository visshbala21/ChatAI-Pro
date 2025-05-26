# ChatAI Pro - Advanced AI Chat Platform

A modern, full-stack AI chat application built with Next.js 15, featuring OpenAI models with placeholders for future AI providers, user authentication, conversation persistence, and usage tracking.

## 🚀 Features

### Core Features
- **OpenAI Integration**: Full support for GPT-4, GPT-4 Turbo, and GPT-3.5 Turbo
- **Future AI Providers**: Placeholder support for Anthropic Claude and Google Gemini (coming soon)
- **User Authentication**: Email/password and OAuth (GitHub, Google) authentication
- **Conversation Management**: Persistent chat history with conversation organization
- **Real-time Streaming**: Live AI responses with streaming support
- **Usage Tracking**: Monitor API usage and costs per user
- **Responsive Design**: Modern UI with dark/light mode support

### Technical Features
- **Database Integration**: PostgreSQL with Drizzle ORM
- **Session Management**: NextAuth.js for secure authentication
- **Type Safety**: Full TypeScript implementation
- **API Rate Limiting**: Built-in usage limits and tracking
- **Middleware Protection**: Route-level authentication
- **Modern UI**: Tailwind CSS with Radix UI components

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: Vercel AI SDK with OpenAI
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: NextAuth.js with multiple providers
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key (required)
- OAuth app credentials (optional)

## 🚀 Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd ChatAI-Pro
npm install --legacy-peer-deps
\`\`\`

### 2. Environment Setup

Copy the environment template:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your environment variables in `.env.local`:

\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/chatai_pro"

# Authentication
NEXTAUTH_SECRET="your-secure-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI (Required)
OPENAI_API_KEY="sk-your-openai-api-key-here"

# OAuth (optional)
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
\`\`\`

### 3. Database Setup

Generate and run database migrations:
\`\`\`bash
npm run db:generate
npm run db:migrate
\`\`\`

### 4. Development

Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🤖 AI Models

### Currently Available
- **GPT-4**: Most capable OpenAI model
- **GPT-4 Turbo**: Faster version of GPT-4
- **GPT-3.5 Turbo**: Fast and efficient model

### Coming Soon (Placeholders)
- **Claude 3 Models**: Anthropic's AI models (currently uses GPT-4 as fallback)
- **Gemini Pro**: Google's AI model (currently uses GPT-4 as fallback)

When you select a "Coming Soon" model, the system will:
1. Use an OpenAI model as a fallback
2. Inform the AI to roleplay as the requested model
3. Track both the requested and actual model used
4. Display a "Coming Soon" badge in the UI

## 🔧 Configuration

### Adding New AI Providers

When you're ready to add Anthropic or Google AI:

1. Install the required packages:
\`\`\`bash
npm install @ai-sdk/anthropic @ai-sdk/google
\`\`\`

2. Add API keys to your environment:
\`\`\`env
ANTHROPIC_API_KEY="sk-ant-..."
GOOGLE_AI_API_KEY="..."
\`\`\`

3. Update the `getAIProvider` function in `app/api/chat/route.ts`
4. Set `isAvailable: true` for the new models
5. Update the UI to remove "Coming Soon" badges

## 📁 Project Structure

\`\`\`
ChatAI-Pro/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── chat/          # Chat API (OpenAI only)
│   │   └── conversations/ # Conversation management
│   ├── chat/              # Chat interface
│   ├── login/             # Authentication pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   └── db/               # Database configuration
├── middleware.ts          # Route protection
└── drizzle.config.ts     # Database configuration
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set:
- Update `NEXTAUTH_URL` to your production domain
- Use a strong `NEXTAUTH_SECRET`
- Configure production database URL
- Add your OpenAI API key

## 🔒 Security Features

- **Route Protection**: Middleware-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Session Management**: Secure JWT-based sessions
- **API Rate Limiting**: Built-in usage tracking and limits
- **Input Validation**: Zod schema validation
- **CSRF Protection**: NextAuth.js built-in protection

## 📊 Usage Tracking

The application tracks:
- API calls per user
- Token usage per conversation
- Cost estimation
- Model usage statistics (including fallback usage)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using Next.js and the Vercel AI SDK

**Note**: Currently only OpenAI models are functional. Other AI providers are implemented as placeholders and will use OpenAI models as fallbacks until their respective API keys are configured.
# Updated Mon May 26 14:00:30 CDT 2025
