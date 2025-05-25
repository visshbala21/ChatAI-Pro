# ChatAI Pro - Advanced AI Chat Platform

A modern, full-stack AI chat application built with Next.js 15, featuring multiple AI providers, user authentication, conversation persistence, and usage tracking.

## 🚀 Features

### Core Features
- **Multiple AI Providers**: Support for OpenAI (GPT-4, GPT-3.5), Anthropic (Claude), and Google (Gemini)
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
- **AI SDKs**: Vercel AI SDK with multiple providers
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: NextAuth.js with multiple providers
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- AI Provider API keys (OpenAI, Anthropic, Google)
- OAuth app credentials (optional)

## 🚀 Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd ChatAI-Pro
pnpm install
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

# AI Providers (at least one required)
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
GOOGLE_AI_API_KEY="..."

# OAuth (optional)
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
\`\`\`

### 3. Database Setup

Generate and run database migrations:
\`\`\`bash
pnpm db:generate
pnpm db:migrate
\`\`\`

### 4. Development

Start the development server:
\`\`\`bash
pnpm dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🗄️ Database Schema

The application uses the following main tables:

- **users**: User accounts and subscription info
- **accounts**: OAuth account linking
- **sessions**: User session management
- **conversations**: Chat conversation metadata
- **messages**: Individual chat messages
- **api_keys**: User's personal API keys
- **usage_tracking**: API usage and cost tracking

## 🔧 Configuration

### AI Providers

Configure AI providers in your environment:

1. **OpenAI**: Get API key from [OpenAI Platform](https://platform.openai.com)
2. **Anthropic**: Get API key from [Anthropic Console](https://console.anthropic.com)
3. **Google**: Get API key from [Google AI Studio](https://makersuite.google.com)

### OAuth Setup

For GitHub OAuth:
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`

For Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

## 📁 Project Structure

\`\`\`
ChatAI-Pro/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── chat/          # Chat API
│   │   └── conversations/ # Conversation management
│   ├── chat/              # Chat interface
│   ├── login/             # Authentication pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   └── db/               # Database configuration
│       ├── schema.ts     # Database schema
│       └── index.ts      # Database connection
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

Make sure to set all required environment variables:
- Update `NEXTAUTH_URL` to your production domain
- Use a strong `NEXTAUTH_SECRET`
- Configure production database URL
- Add all AI provider API keys

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
- Model usage statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the [Issues](https://github.com/your-username/chatai-pro/issues) page
- Create a new issue for bugs or feature requests

## 🔄 Updates

This project is actively maintained. Check the [releases](https://github.com/your-username/chatai-pro/releases) for updates.

---

Built with ❤️ using Next.js and the Vercel AI SDK
