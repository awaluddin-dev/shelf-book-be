# shelf-book-be

> Headless CMS API powering my personal portfolio — built with NestJS, Prisma, and PostgreSQL.

A RESTful backend that serves structured content for [shelf-book-portfolio](https://github.com/awaluddin-dev/shelf-book-portofolio): work experience, projects, skills, roadmap, testimonials, and hero configuration. All write operations are protected behind JWT authentication.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11 (Fastify adapter) |
| Language | TypeScript |
| ORM | Prisma v7 |
| Database | PostgreSQL (Aiven cloud / Docker local) |
| Cache | Redis |
| Auth | JWT (access + refresh token) |
| Password | Argon2 |
| API Docs | Swagger UI |
| Deploy | Docker + OpsCtrl (Kubernetes) |

---

## Project Structure

```
src/
├── auth/                  # JWT Guard & Strategy
├── common/                # HTTP filter, interceptor, rate limiter
├── features/
│   ├── auth/              # Register, Login, Refresh Token
│   ├── contact/           # Contact form → Resend email
│   ├── github/            # GitHub contributions proxy
│   └── portfolio/         # All portfolio content endpoints
├── prisma/                # PrismaService with pg adapter + SSL
└── redis/                 # RedisModule
prisma/
├── schema.prisma          # Database schema
├── seed.ts                # Initial data seeder
└── migrations/            # SQL migration history
```

---

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/hero` | — | Hero section config |
| PATCH | `/api/hero` | ✅ | Update hero config |
| GET | `/api/status` | — | Portfolio status |
| GET | `/api/work` | — | Work experience list |
| GET | `/api/projects` | — | Projects list |
| POST | `/api/projects` | ✅ | Add project |
| PATCH | `/api/projects/:id` | ✅ | Update project |
| DELETE | `/api/projects/:id` | ✅ | Delete project |
| GET | `/api/skills` | — | Skills / proficiency list |
| GET | `/api/learning` | — | Roadmap / learning goals |
| GET | `/api/testimonials` | — | Testimonials |
| POST | `/api/testimonials` | ✅ | Add testimonial |
| GET | `/api/current` | — | Current focus |
| GET | `/api/showcase` | — | Visual showcase |
| GET | `/api/architecture` | — | System architecture |
| GET | `/api/lifecycle` | — | Project lifecycle |
| GET | `/api/github/contributions/:username` | — | GitHub activity |
| POST | `/api/contact/inquiry` | — | Send contact email |
| POST | `/api/auth/register` | — | Create admin account |
| POST | `/api/auth/login` | — | Login (returns JWT) |
| POST | `/api/auth/refresh` | — | Refresh access token |

Full interactive docs available at `/api/docs` (Swagger UI).

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

# 5. Sync database schema
npx prisma db push

# 6. Seed initial data
npx prisma db seed

# 7. Start dev server
pnpm start:dev
```

Server runs at **http://localhost:3000**
Swagger UI at **http://localhost:3000/api/docs**

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
JWT_SECRET="your_secret"

# Optional
RESEND_API_KEY=""
GITHUB_TOKEN=""
```

See [`.env.example`](.env.example) for the full list with descriptions.

---

## Production Deployment (OpsCtrl)

The app is deployed to [OpsCtrl](https://opsctrl.dev) via the `ftr/prod` branch. On every push, OpsCtrl automatically:

1. Builds a Docker image using the `Dockerfile`
2. Runs `start.sh` inside the container which:
   - Patches missing schema columns via `fix-schema.js`
   - Runs `npx prisma migrate deploy`
   - Runs `npx prisma db seed`
   - Starts the NestJS app via `node dist/src/main.js`

The production database is **Aiven PostgreSQL** and the connection is secured via TLS using `DATABASE_CA`.

---

## License

MIT
