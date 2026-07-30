# 🎬 Clipper Next.js

An AI-powered video clipping & short-form content generation platform built with **Next.js 16**, **TypeScript**, **Prisma**, **BullMQ**, **faster-whisper**, and **FFmpeg**. 

Clipper automatically ingests YouTube videos, transcribes audio with precise timestamps, uses LLMs to extract viral highlight clips with hooks and scores, renders vertical/short-form videos, and uploads them to cloud storage.

---

## ⚡ Features

- 📺 **YouTube Integration**: Direct video/audio ingestion powered by `yt-dlp`.
- 🗣️ **High-Performance Transcription**: Local timestamped speech-to-text using `faster-whisper` (Python).
- 🧠 **AI Highlight Extraction**: AI-powered analysis via OpenAI-compatible APIs (`gpt-4o-mini`, etc.) to discover viral hooks, clip scores, and platform targets (TikTok, YouTube Shorts, Reels).
- ✂️ **Automated Video Clipping**: Smart video cropping and trimming using `FFmpeg`.
- 🔄 **Distributed Task Queue**: Scalable background pipeline powered by `BullMQ` & `Redis`.
- ☁️ **Cloud Media Storage**: S3-compatible object storage integration via Cloudflare R2.
- 🔐 **Multi-Provider Authentication**: NextAuth.js v4 supporting Google, GitHub, Discord, and Credentials.
- 💳 **Subscriptions & Credits**: Integrated credit system and subscription management powered by Polar.sh.
- 🎨 **Modern Design & UI**: Dynamic dark mode interface built with React 19, Tailwind CSS v4, Motion (Framer Motion), and Shadcn UI components.
- 🐳 **Dockerized Stack**: Fully containerized environment with Docker Compose (PostgreSQL, Redis, Worker, Adminer, Redis Commander).

---

## 🏗️ Architecture & Pipeline

```mermaid
flowchart TD
    User([User]) -->|Submit YouTube URL| App[Next.js App Router]
    App -->|Create Project & Enqueue Job| DB[(PostgreSQL / Prisma)]
    App -->|Push Task| Redis[(Redis / BullMQ)]
    
    subgraph Worker ["Background Worker (src/worker.ts)"]
        DL[1. Download Worker\nyt-dlp] --> TR[2. Transcribe Worker\nfaster-whisper]
        TR --> AN[3. Analyze Worker\nOpenAI / LLM API]
        AN --> RN[4. Render Worker\nFFmpeg]
        RN --> UP[5. Upload Worker\nCloudflare R2]
    end

    Redis --> Worker
    Worker -->|Update Status & Clips| DB
    Worker -->|Store Media Assets| R2[(Cloudflare R2)]
    User -->|View & Download Clips| App
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack) & [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) & [Python 3](https://www.python.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Motion](https://motion.dev/), [Shadcn UI](https://ui.shadcn.com/)
- **State & Data Fetching**: [Zustand](https://zustand-demo.pmnd.rs/), [TanStack React Query](https://tanstack.com/query)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) & [Prisma ORM 6](https://www.prisma.io/)
- **Background Worker & Queue**: [BullMQ](https://docs.bullmq.io/) & [Redis](https://redis.io/)
- **Media & Processing**: `FFmpeg`, `yt-dlp`, `faster-whisper`
- **Authentication**: [NextAuth.js v4](https://next-auth.js.org/)
- **Payments & Subscriptions**: [Polar.sh](https://polar.sh/)
- **Object Storage**: [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) / AWS S3 SDK
- **Observability**: [Sentry](https://sentry.io/)

---

## 📋 Prerequisites

### Using Docker (Recommended)
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/)

### Local Manual Setup
- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Python 3 with `faster-whisper` installed (`pip install faster-whisper`)
- `ffmpeg` & `yt-dlp` installed in system PATH

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <repository-url>
cd clipper-nextjs
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in required credentials in `.env`:

```env
# Database & Redis
DATABASE_URL="postgresql://clipper_user:clipper_pass@localhost:5433/clipper_db"
REDIS_URL="redis://localhost:6379"
BULLMQ_REDIS_URL="redis://localhost:6380"

# Authentication
AUTH_SECRET="your-generated-auth-secret"

# AI Model Configuration
AI_PROVIDER="openai"
AI_MODEL="gpt-4o-mini"
AI_BASE_URL="https://api.openai.com/v1"
AI_API_KEY="sk-..."

# Cloudflare R2 Storage
R2_ENDPOINT="https://<account-id>.r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID="your-access-key-id"
R2_SECRET_ACCESS_KEY="your-secret-access-key"
R2_BUCKET_NAME="clipper"
R2_PUBLIC_URL="https://pub-<id>.r2.dev"
```

> **Tip:** You can generate a secure `AUTH_SECRET` by running:
> ```bash
> npm run generate:auth
> ```

---

## 🐳 Running with Docker Compose

The easiest way to start all services (PostgreSQL, Redis, BullMQ Redis, Worker) is via Docker Compose:

```bash
# Start PostgreSQL, Redis, and the background worker
docker compose up -d

# Generate Prisma Client & Run Database Migrations
npx prisma generate
npm run db:migrate

# Start Next.js Development Server locally
npm run dev
```

### Management Tools (Optional)

Run with the `--profile tools` flag to enable web administration dashboards:

```bash
docker compose --profile tools up -d
```
- **Adminer (Database GUI)**: [http://localhost:8080](http://localhost:8080)
- **Redis Commander**: [http://localhost:8081](http://localhost:8081)

---

## 💻 Local Development Workflow

When developing locally without Docker worker containers:

1. **Start Database & Caches**:
   ```bash
   docker compose up postgres redis bullmq-redis -d
   ```
2. **Apply Database Migrations**:
   ```bash
   npm run db:migrate
   ```
3. **Start the Background Worker**:
   ```bash
   npm run worker
   ```
4. **Start the Web App**:
   ```bash
   npm run dev
   ```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run worker` | Starts the BullMQ multi-step processing worker |
| `npm run build` | Builds the production application bundle |
| `npm run start` | Runs the production server |
| `npm run preview` | Builds and starts the production app locally |
| `npm run generate:auth` | Generates a new `AUTH_SECRET` for NextAuth |
| `npm run check` | Runs ESLint and TypeScript checks |
| `npm run typecheck` | Validates TypeScript types |
| `npm run lint` | Runs ESLint |
| `npm run db:generate` | Generates Prisma client & runs dev migrations |
| `npm run db:migrate` | Applies production database migrations |
| `npm run db:push` | Pushes Prisma schema changes directly to DB |
| `npm run db:studio` | Opens Prisma Studio GUI |
| `npm run format:write` | Formats code with Prettier |

### Pipeline Debug Scripts

- `npx tsx scripts/test-pipeline.ts` - Test the full clipping job execution pipeline.
- `npx tsx scripts/check-status.ts` - Inspect job progress and statuses in Redis/DB.
- `npx tsx scripts/retry-pipeline.ts` - Retry failed queue jobs.

---

## 📁 Project Structure

```
clipper-nextjs/
├── prisma/               # Database schema & migrations
├── public/               # Static assets
├── scripts/              # Pipeline testing & utility scripts
├── src/
│   ├── app/              # Next.js App Router (auth, dashboard, public, API routes)
│   ├── components/       # UI components (Shadcn, custom widgets)
│   ├── env.ts            # T3 Env Zod validation
│   ├── features/         # Feature modules (projects, clips, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── lib/
│   │   ├── ai/           # LLM highlight extraction prompts & client
│   │   ├── auth.ts       # NextAuth.js configuration
│   │   ├── prisma.ts     # Prisma client instance
│   │   ├── queue/        # BullMQ queue definitions & worker step handlers
│   │   ├── storage/      # Cloudflare R2 / S3 client
│   │   └── utils/        # FFmpeg, yt-dlp, faster-whisper integration
│   ├── types/            # TypeScript definitions
│   └── worker.ts         # Standalone processing worker entrypoint
├── Dockerfile            # Container definition for worker & app
└── docker-compose.yml    # Full service orchestration
```

---

## ☕ Support & Contributions

If you find Clipper Next.js useful, feel free to star the repository or support development:

[![Support on Ko-fi](https://img.shields.io/badge/Ko--fi-Donate-ff5e5b?logo=ko-fi)](https://ko-fi.com/zakialawi)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

