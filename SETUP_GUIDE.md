# ChatAI Pro - Complete Setup and Testing Guide

This guide will walk you through setting up and testing the ChatAI Pro application from scratch.

## 🔧 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **PostgreSQL** (Download from [postgresql.org](https://www.postgresql.org/download/))
- **Git** (Download from [git-scm.com](https://git-scm.com/))

## 📋 Step-by-Step Setup

### Step 1: Clone and Navigate to Project

\`\`\`bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd ChatAI-Pro
\`\`\`

### Step 2: Install Dependencies

\`\`\`bash
# Install all project dependencies
npm install --legacy-peer-deps
\`\`\`

**Note**: We use `--legacy-peer-deps` to handle some dependency conflicts that have been resolved.

### Step 3: Environment Configuration

1. **Copy the environment template:**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. **Edit `.env.local` with your configuration:**
   \`\`\`bash
   nano .env.local  # or use your preferred editor
   \`\`\`

3. **Required Environment Variables:**

   \`\`\`env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/chatai_pro"

   # Authentication (REQUIRED)
   NEXTAUTH_SECRET="your-secure-secret-here-change-this-in-production"
   NEXTAUTH_URL="http://localhost:3000"

   # AI Providers (at least one required)
   OPENAI_API_KEY="sk-your-openai-api-key-here"
   ANTHROPIC_API_KEY="sk-ant-your-anthropic-api-key-here"
   GOOGLE_AI_API_KEY="your-google-ai-api-key-here"

   # OAuth Providers (optional)
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   GOOGLE_CLIENT_ID="your-google-oauth-client-id"
   GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

   # Development
   NODE_ENV="development"
   \`\`\`

### Step 4: Database Setup

1. **Create PostgreSQL Database:**
   \`\`\`bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE chatai_pro;

   # Create user (optional)
   CREATE USER chatai_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE chatai_pro TO chatai_user;

   # Exit PostgreSQL
   \q
   \`\`\`

2. **Update DATABASE_URL in `.env.local`:**
   \`\`\`env
   DATABASE_URL="postgresql://chatai_user:your_password@localhost:5432/chatai_pro"
   \`\`\`

3. **Generate and Run Database Migrations:**
   \`\`\`bash
   # Generate migration files
   npm run db:generate

   # Apply migrations to database
   npm run db:migrate
   \`\`\`

### Step 5: Get AI Provider API Keys

#### OpenAI (Recommended)
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to `.env.local` as `OPENAI_API_KEY`

#### Anthropic (Optional)
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create a new API key
3. Add to `.env.local` as `ANTHROPIC_API_KEY`

#### Google AI (Optional)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `.env.local` as `GOOGLE_AI_API_KEY`

### Step 6: OAuth Setup (Optional)

#### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App with:
   - Application name: `ChatAI Pro Local`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Add Client ID and Secret to `.env.local`

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials with:
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Add Client ID and Secret to `.env.local`

## 🚀 Running the Application

### Development Mode

\`\`\`bash
# Start the development server
npm run dev
\`\`\`

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

\`\`\`bash
# Build the application
npm run build

# Start production server
npm start
\`\`\`

## 🧪 Testing the Application

### 1. Basic Functionality Test

1. **Open the application** at [http://localhost:3000](http://localhost:3000)
2. **Check the homepage** loads correctly
3. **Navigate to login page** at [http://localhost:3000/login](http://localhost:3000/login)

### 2. Authentication Testing

#### Email/Password Registration
1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Click "Sign up" or register link
3. Create a new account with email and password
4. Verify you can log in with the created credentials

#### OAuth Testing (if configured)
1. Try logging in with GitHub or Google
2. Verify the OAuth flow works correctly
3. Check that user data is properly stored

### 3. Chat Functionality Testing

1. **Access Chat Interface:**
   - Navigate to [http://localhost:3000/chat](http://localhost:3000/chat)
   - Ensure you're logged in

2. **Test AI Conversations:**
   - Send a test message: "Hello, how are you?"
   - Verify AI responds correctly
   - Test different AI models if multiple are configured

3. **Test Conversation Features:**
   - Create multiple conversations
   - Rename conversations
   - Delete conversations
   - Check conversation persistence

### 4. Settings Testing

1. **Navigate to Settings:**
   - Go to [http://localhost:3000/settings](http://localhost:3000/settings)

2. **Test Configuration:**
   - Update user profile information
   - Test API key management (if implemented)
   - Check usage tracking (if implemented)

### 5. Database Verification

\`\`\`bash
# Connect to your database
psql -U chatai_user -d chatai_pro

# Check tables were created
\dt

# Verify user data
SELECT * FROM users;

# Check conversations
SELECT * FROM conversations;

# Exit
\q
\`\`\`

## 🛠️ Development Tools

### Database Management

\`\`\`bash
# View database in browser
npm run db:studio
\`\`\`

This opens Drizzle Studio at [http://localhost:4983](http://localhost:4983)

### Code Quality

\`\`\`bash
# Run linting
npm run lint

# Build check
npm run build
\`\`\`

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in `.env.local`
   - Ensure database exists

2. **AI API Errors:**
   - Verify API keys are correct
   - Check API key permissions
   - Ensure you have credits/quota

3. **Build Errors:**
   - Clear node_modules: `rm -rf node_modules package-lock.json`
   - Reinstall: `npm install --legacy-peer-deps`

4. **Port Already in Use:**
   - Change port: `npm run dev -- -p 3001`
   - Or kill process using port 3000

### Environment Issues

1. **Missing Environment Variables:**
   - Check `.env.local` exists
   - Verify all required variables are set
   - Restart development server after changes

2. **OAuth Issues:**
   - Verify callback URLs match exactly
   - Check client IDs and secrets
   - Ensure OAuth apps are active

## 📊 Performance Testing

### Load Testing (Optional)

1. **Install testing tools:**
   \`\`\`bash
   npm install -g artillery
   \`\`\`

2. **Create test script** (`load-test.yml`):
   \`\`\`yaml
   config:
     target: 'http://localhost:3000'
     phases:
       - duration: 60
         arrivalRate: 10
   scenarios:
     - name: "Homepage load test"
       requests:
         - get:
             url: "/"
   \`\`\`

3. **Run load test:**
   \`\`\`bash
   artillery run load-test.yml
   \`\`\`

## 🚀 Deployment Preparation

### Environment Variables for Production

When deploying, ensure you update:

- `NEXTAUTH_URL` to your production domain
- `NEXTAUTH_SECRET` to a strong, unique secret
- `DATABASE_URL` to your production database
- OAuth callback URLs to production URLs

### Security Checklist

- [ ] Strong `NEXTAUTH_SECRET` set
- [ ] Database credentials secured
- [ ] API keys properly configured
- [ ] OAuth apps configured for production URLs
- [ ] Environment variables not exposed in client-side code

## 📞 Support

If you encounter issues:

1. Check this guide thoroughly
2. Verify all environment variables
3. Check the application logs
4. Review the database connection
5. Test with minimal configuration first

## 🎉 Success Indicators

Your setup is successful when:

- ✅ Application builds without errors
- ✅ Database migrations run successfully
- ✅ User registration/login works
- ✅ AI chat functionality works
- ✅ Conversations are saved and retrieved
- ✅ All pages load without errors

Congratulations! Your ChatAI Pro application is now ready for development and testing.
