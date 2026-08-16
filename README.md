# shelf-book-be

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

> Headless CMS API powering my personal portfolio — built with NestJS, Prisma, and PostgreSQL.

A RESTful backend that serves structured content for [shelf-book-portofolio](https://github.com/awaluddin-dev/shelf-book-portofolio): hero configuration, work experience, projects, skills, learning roadmap, testimonials, system architecture, and project lifecycles. All write operations are protected behind JWT authentication, and a set of AI endpoints stream LLM responses (chat, cover letter, project explanation) over SSE.

---

## 🚀 Key Features
- **AI-Powered (RAG) & SSE Streaming**: Integrates multi-LLM providers (Custom, Groq, Gemini) with automatic failover. Features a RAG-backed chat that retrieves your portfolio data to answer recruiter questions in real-time.
- **Enterprise-Grade Architecture**: Built on NestJS using the high-performance Fastify adapter.
- **Robust Security & Auth**: Implements JWT Access/Refresh tokens, Argon2 password hashing, Redis-backed rate limiting, and Helmet.
- **Interactive API Docs**: Fully documented REST API powered by Swagger and Scalar API Reference.
- **Production Ready**: Fully dockerized and integrated with Kubernetes (OpsCtrl) CI/CD pipelines.

---

## Tech Stack

| Layer              | Technology                                                      |
| ------------------ | --------------------------------------------------------------- |
| Framework          | NestJS 11 (Fastify adapter)                                     |
| Language           | TypeScript                                                      |
| ORM                | Prisma v7 (pg driver adapter)                                   |
| Database           | PostgreSQL (Aiven cloud / Docker local)                         |
| Cache / Rate limit | Redis (ioredis)                                                 |
| Auth               | JWT (access + refresh token, Passport)                          |
| Password hashing   | Argon2                                                          |
| API Docs           | Swagger UI                                                      |
| Security / Perf    | Helmet, Compression, Timeout interceptor                        |
| Email              | Resend (contact form)                                           |
| AI                 | OpenAI-compatible LLM providers (multi-fallback, SSE streaming) |
| Deploy             | Docker + OpsCtrl (Kubernetes)                                   |

---

## System Architecture

![System Architecture](./assets/architecture/shelf-book-architecture.excalidraw.svg)

---

## Project Structure

```
src/
├── auth/                   # JWT Guard & Strategy (shared)
├── common/                 # Transform/Timeout interceptors, exception filter,
│   │                       # Redis rate-limit service, base CRUD service
│   ├── filters/            #   Global HTTP exception filter
│   └── services/           #   Rate-limit & base CRUD
├── features/
│   ├── ai/                 # LLM-powered endpoints (SSE streaming)
│   │   ├── chat/           #   RAG-backed portfolio chat + retrieval service
│   │   ├── cover-letter/   #   Cover letter generator + draft inquiry
│   │   ├── providers/      #   Multi-provider LLM abstraction (custom/Groq/Gemini)
│   │   └── dto/            #   Request DTOs
│   ├── auth/               # Register, Login, Refresh Token
│   ├── contact/            # Contact form → Resend email (rate-limited)
│   ├── github/             # GitHub GraphQL contributions proxy
│   └── portfolio/          # Hero, experience, skills, projects content
├── health/                 # Terminus health check (DB + memory)
├── prisma/                 # PrismaService (pg adapter + SSL support)
└── redis/                  # RedisModule (ioredis)
prisma/
├── schema.prisma           # Database schema
└── migrations/             # SQL migration history
```

---

## API Endpoints

Responses are wrapped in a `{ data: ... }` envelope by the global `TransformInterceptor`.

| Method                | Route                                 | Auth | Description                            |
| --------------------- | ------------------------------------- | ---- | -------------------------------------- |
| GET                   | `/api/health`                         | —    | Health check (DB ping + memory heap)   |
| GET                   | `/api/status`                         | —    | Portfolio availability status          |
| POST                  | `/api/status`                         | ✅   | Update portfolio status                |
| GET                   | `/api/hero`                           | —    | Hero config + metrics                  |
| PATCH                 | `/api/hero`                           | ✅   | Update hero config & metrics           |
| GET                   | `/api/work`                           | —    | Work experience list                   |
| POST / PATCH / DELETE | `/api/work(/:id)`                     | ✅   | Manage work experience                 |
| GET                   | `/api/current`                        | —    | Current focus list                     |
| POST / PATCH / DELETE | `/api/current(/:id)`                  | ✅   | Manage current focus                   |
| GET                   | `/api/testimonials`                   | —    | Testimonials list                      |
| POST                  | `/api/testimonials`                   | —    | Submit testimonial (rate-limited)      |
| PATCH / DELETE        | `/api/testimonials/:id`               | ✅   | Moderate testimonials                  |
| GET                   | `/api/projects`                       | —    | Projects list                          |
| POST / PATCH / DELETE | `/api/projects(/:id)`                 | ✅   | Manage projects                        |
| GET                   | `/api/architecture`                   | —    | System architecture list               |
| POST / PATCH / DELETE | `/api/architecture(/:id)`             | ✅   | Manage architecture                    |
| GET                   | `/api/lifecycle`                      | —    | Project lifecycle list                 |
| POST / PATCH / DELETE | `/api/lifecycle(/:id)`                | ✅   | Manage lifecycle                       |
| GET                   | `/api/technical-imagery`              | —    | Technical imagery list                 |
| POST / PATCH / DELETE | `/api/technical-imagery(/:id)`        | ✅   | Manage technical imagery               |
| GET                   | `/api/proficiency`                    | —    | Proficiency categories                 |
| POST / PATCH / DELETE | `/api/proficiency(/:id)`              | ✅   | Manage proficiency                     |
| GET                   | `/api/skills`                         | —    | Skills list                            |
| POST / PATCH / DELETE | `/api/skills(/:id)`                   | ✅   | Manage skills                          |
| GET                   | `/api/learning`                       | —    | Learning roadmap                       |
| POST / PATCH / DELETE | `/api/learning(/:id)`                 | ✅   | Manage roadmap                         |
| GET                   | `/api/github/contributions/:username` | —    | GitHub heatmap + repo/language stats   |
| POST                  | `/api/contact/inquiry`                | —    | Send contact email (rate-limited)      |
| POST                  | `/api/auth/register`                  | —    | Create admin account                   |
| POST                  | `/api/auth/login`                     | —    | Login (returns access + refresh token) |
| POST                  | `/api/auth/refresh`                   | —    | Refresh access token                   |
| POST                  | `/api/ai/explain-project`             | —    | SSE: AI project explanation            |
| POST                  | `/api/ai/chat`                        | —    | SSE: RAG-backed portfolio chat         |
| POST                  | `/api/ai/cover-letter`                | —    | SSE: cover letter generator            |
| POST                  | `/api/ai/draft-inquiry`               | —    | SSE: draft recruiter inquiry email     |

Full interactive docs available at `/api/docs` (Swagger UI).

---

## AI Endpoints

The AI endpoints stream OpenAI-compatible chunks as **Server-Sent Events** (`text/event-stream`). Providers are tried in order with automatic fallback:

1. **Custom** — self-hosted / any OpenAI-compatible endpoint (`AI_CUSTOM_*`)
2. **Groq** — fast free-tier inference (`GROQ_API_KEY`)
3. **Gemini** — via OpenAI-compatible endpoint (`GEMINI_API_KEY`)

`/api/ai/chat` performs **RAG retrieval** against the portfolio database: it extracts keywords from the question (with Indonesian → English translation for common domain terms), searches hero/work/skills/projects/testimonials/current-focus tables, and injects the results into the LLM prompt.

---

## Local Development

### Prerequisites

- Node.js ≥ 20
- pnpm
- Docker & Docker Compose

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/awaluddin-dev/shelf-book-be.git
cd shelf-book-be

# 2. Install dependencies
pnpm install

# 3. Start local PostgreSQL & Redis
docker-compose up -d

# 4. Configure environment
cp .env.example .env
# Edit .env with your values

# 5. Sync database schema (apply existing migrations)
npx prisma migrate deploy
# or for quick schema sync during active development:
# npx prisma db push

# 6. Start dev server
pnpm start:dev
```

Server runs at **http://localhost:3000** (default port is `8080` when `PORT` is unset).
Swagger UI at **http://localhost:3000/api/docs**.

> Note: a seed script is configured in `prisma.config.ts` (`node dist/prisma/seed.js`) but is not part of this repository yet — skip `prisma db seed` until a seed file is added.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values.

```env
# Local database (docker-compose)
DATABASE_URL="postgresql://admin:admin123@localhost:5432/portfolio-prod?sslmode=disable"

# Production Aiven database (takes priority when set)
AIVEN_DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"

# SSL for Aiven CA verification
DB_REQUIRE_SSL="false"
DATABASE_CA=""          # base64-encoded Aiven CA cert

REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your_secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# App
PORT=3000
HOST="0.0.0.0"
FRONTEND_URL="http://localhost:3000"   # CORS allowlist

# AI (at least one provider required for AI endpoints)
AI_CUSTOM_BASE_URL=""                  # optional self-hosted / OpenAI-compatible endpoint
AI_CUSTOM_API_KEY=""
AI_CUSTOM_MODEL="gpt-4o-mini"
GROQ_API_KEY=""
GEMINI_API_KEY=""

# Optional
RESEND_API_KEY=""
RESEND_FROM="noreply@yourdomain.com"
RESEND_TO="your@email.com"
GITHUB_TOKEN=""
TURNSTILE_SECRET_KEY=""
```

See [`.env.example`](.env.example) for the full list with descriptions.

---

## Testing & Quality

```bash
pnpm test          # unit tests (Jest)
pnpm test:cov      # coverage report
pnpm test:e2e      # e2e tests
pnpm lint          # ESLint
pnpm sonar         # SonarQube scanner
```

---

## Production Deployment (OpsCtrl)

The app is deployed to [OpsCtrl](https://opsctrl.dev) (Kubernetes) via the `ftr/prod` branch. On every push, OpsCtrl automatically:

1. Builds a Docker image using the `Dockerfile` (Node 22 Alpine, pnpm, multi-stage)
2. Runs `start.sh` inside the container which:
   - Starts a dummy healthcheck server on port 8080 to satisfy K8s probes during DB init
   - Runs `npx prisma db push --accept-data-loss` to sync the schema
   - Starts the NestJS app via `node dist/src/main.js`

The production database is **Aiven PostgreSQL** and the connection is secured via TLS using `DATABASE_CA` when `DB_REQUIRE_SSL=true`.

---

## License

MIT
