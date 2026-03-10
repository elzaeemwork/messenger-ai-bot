# MessengerAI Bot Dashboard 🤖

An intelligent Facebook Messenger auto-reply system powered by Claude AI, with a beautiful dark-themed dashboard for management.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui, Recharts
- **Backend**: Vercel Serverless Functions (Next.js API Routes)
- **AI**: Anthropic Claude API
- **Database**: Supabase (PostgreSQL)
- **State**: Zustand

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and add your keys
cp .env.example .env.local

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Claude AI API key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `PAGE_ACCESS_TOKEN` | Facebook Page Access Token |
| `VERIFY_TOKEN` | Webhook verification token |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (webhook, settings, send-message)
│   └── dashboard/         # Dashboard pages
├── components/            # React components
│   ├── ui/               # shadcn/ui primitives
│   ├── layout/           # Sidebar, TopBar, MobileNav
│   ├── dashboard/        # Dashboard widgets
│   ├── conversations/    # Chat UI components
│   └── settings/         # Settings form components
├── lib/                   # Core libraries
│   ├── anthropic/        # Claude AI client & prompt builder
│   ├── facebook/         # Graph API & webhook verification
│   ├── supabase/         # Database clients
│   └── utils/            # Helpers (logger, formatters, cn)
├── hooks/                # React hooks
├── store/                # Zustand store
├── types/                # TypeScript types
└── config/               # App configuration
```

## 🔌 Facebook Webhook Setup

1. Deploy to Vercel
2. In Facebook Developer Console, create a new webhook
3. Set callback URL: `https://your-app.vercel.app/api/webhook`
4. Set verify token to match your `VERIFY_TOKEN`
5. Subscribe to `messages` events

## 📦 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Import from GitHub
2. Add all environment variables
3. Deploy!

## 📄 License

MIT
