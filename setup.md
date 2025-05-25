# ChatAI Pro Setup Guide

## 🚀 Quick Setup Instructions

### 1. Environment Configuration

Your `.env.local` file has been created with placeholder values. You need to fill in the following:

#### Required (Minimum to run):
\`\`\`bash
# Add your OpenAI API key (get from https://platform.openai.com)
OPENAI_API_KEY="sk-your-openai-key-here"

# Set up a PostgreSQL database (local or cloud)
DATABASE_URL="postgresql://username:password@localhost:5432/chatai_pro"
\`\`\`

#### Optional (for full functionality):
\`\`\`bash
# For Anthropic Claude models
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key"

# For Google Gemini models  
GOOGLE_AI_API_KEY="your-google-ai-key"

# For GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# For Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
\`\`\`

### 2. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database: `createdb chatai_pro`
3. Update DATABASE_URL in `.env.local`

#### Option B: Cloud Database (Recommended)
1. Sign up for [Neon](https://neon.tech) (free tier available)
2. Create a new database
3. Copy the connection string to DATABASE_URL

### 3. Generate Database Schema

\`\`\`bash
npm run db:generate
npm run db:migrate
\`\`\`

### 4. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## 🔧 Getting API Keys

### OpenAI (Required)
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up/login
3. Go to API Keys section
4. Create a new secret key
5. Add to `.env.local` as `OPENAI_API_KEY`

### Anthropic (Optional)
1. Go to [Anthropic Console](https://console.anthropic.com)
2. Sign up/login
3. Generate an API key
4. Add to `.env.local` as `ANTHROPIC_API_KEY`

### Google AI (Optional)
1. Go to [Google AI Studio](https://makersuite.google.com)
2. Sign up/login
3. Create an API key
4. Add to `.env.local` as `GOOGLE_AI_API_KEY`

## 🔐 OAuth Setup (Optional)

### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: "ChatAI Pro"
   - Homepage URL: "http://localhost:3000"
   - Authorization callback URL: "http://localhost:3000/api/auth/callback/github"
4. Copy Client ID and Client Secret to `.env.local`

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Configure consent screen
6. Add authorized redirect URI: "http://localhost:3000/api/auth/callback/google"
7. Copy Client ID and Client Secret to `.env.local`

## 🎯 Testing the Setup

1. Start the development server: `npm run dev`
2. Go to [http://localhost:3000](http://localhost:3000)
3. Click "Sign Up" and create an account
4. Go to `/chat` and test the AI chat functionality

## 🚨 Troubleshooting

### Database Connection Issues
- Make sure PostgreSQL is running
- Check DATABASE_URL format: `postgresql://user:password@host:port/database`
- Ensure database exists and user has permissions

### API Key Issues
- Verify API keys are correct and active
- Check for any usage limits or billing issues
- Ensure keys are properly set in `.env.local`

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install --legacy-peer-deps`
- Check Node.js version (requires 18+)

## 📝 Next Steps

Once everything is working:

1. **Customize the UI**: Modify components in `/components`
2. **Add Features**: Extend the API routes in `/app/api`
3. **Deploy**: Follow the deployment guide in README.md
4. **Configure Production**: Set up production environment variables

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Review the code comments for implementation details
- Create an issue if you encounter problems

Happy coding! 🚀
