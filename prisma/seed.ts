import { config } from 'dotenv';
config();
console.log('DATABASE_URL is:', process.env.AIVEN_DATABASE_URL);
const experiencesList = [
  {
    years: '2025 - Present',
    duration: 'Ongoing',
    company: 'PT Serasi Autoraya (SERA)',
    role: 'Backend Developer',
    stack: 'Node.js & Go',
    teaser: 'Real-time SAP & Azure Bus Sync',
    fullImpact:
      'Streamlined massive corporate log pipelines and payroll synchronizations with robust event-driven microservices.',
    bullets: [
      'Migrating legacy .NET Driver Management System to highly concurrent Node.js microservices.',
      'Integrating SAP, Mekari Talenta, and FMS 2.0 via Azure Service Bus for critical payroll and logistics data queues.',
      'Achieved sub-second data synchronization latencies under heavy event concurrency.',
    ],
  },
  {
    years: '2024 - 2025',
    duration: '1 year',
    company: 'Telkomsel (Vendor)',
    role: 'Software Engineer',
    stack: 'Kubernetes & IoT',
    teaser: 'Slashed Cloud Costs by $20K+/yr',
    fullImpact:
      'Slashed server infrastructure spend by 90% while running a bulletproof bare-metal Kubernetes IoT pipeline.',
    bullets: [
      'Built and engineered bare-metal Kubernetes clusters with custom-tuned IoT monitoring layers.',
      'Saved between 1,800 to 2,500 USD per month by transitioning architecture away from managed public cloud providers.',
      'Maintained 99.99% system availability under intense device data packet polling.',
    ],
  },
  {
    years: '2023 - 2024',
    duration: '1 year',
    company: 'PT Hensel Davest Indonesia',
    role: 'Full Stack Developer',
    stack: 'Laravel & NestJS',
    teaser: 'OJK & BI Regulatory Compliance',
    fullImpact:
      'Successfully achieved strict banking and lending regulatory approvals single-handedly under extreme deadlines.',
    bullets: [
      'Led solo compliance engineering to meet OJK & BI regulatory standards, securing active fintech licenses.',
      'Rewrote the core P2P lending Laravel monolith into modular NestJS microservices, achieving a 4x increase in API throughput.',
      'Designed secure database architectures safeguarding sensitive transaction records and personal financial data.',
    ],
  },
  {
    years: '2022 - 2023',
    duration: '1 year',
    company: 'PT Maccon Generasi Mandiri',
    role: 'Full Stack Developer',
    stack: 'Laravel, Vue & Postgres',
    teaser: 'Eliminated Vendor Licensing Costs',
    fullImpact:
      'Rebuilt core proprietary vendor tools in-house, ensuring 100% intellectual property ownership and 0% vendor fees.',
    bullets: [
      'Reconstructed external vendor systems from scratch, saving substantial annual licensing and maintenance fees.',
      'Developed end-to-end database schemas and business logic for factory inventory, sales pipeline, and delivery tracking.',
      'Designed dynamic Vue.js frontends paired with PostgreSQL for real-time warehouse data visualization.',
    ],
  },
];

const skillCategoriesList = [
  {
    title: 'CORE BACKEND',
    skills: [
      {
        name: 'Node.js / TypeScript',
        subtext: 'Production · 3+ yrs · SERA, Telkomsel, HDI',
        status: 'Production-ready',
      },
      {
        name: 'NestJS',
        subtext: 'Production · 2+ yrs · Microservices, SAP integration',
        status: 'Production-ready',
      },
      {
        name: 'Go',
        subtext: 'Production · 1 yr · IoT monitoring system',
        status: 'Production-ready',
      },
      {
        name: 'REST API / Event-Driven',
        subtext: 'Production · Applied across all roles',
        status: 'Production-ready',
      },
      {
        name: 'Python',
        subtext: 'In use · LangGraph worker, scripting',
        status: 'In Use',
      },
    ],
  },
  {
    title: 'AI & AUTOMATION',
    skills: [
      {
        name: 'LangGraph',
        subtext: 'Building · AuraFlow AI project',
        status: 'Building',
      },
      {
        name: 'LangChain',
        subtext: 'In use · Agent orchestration',
        status: 'In Use',
      },
      {
        name: 'OpenAI / Gemini API',
        subtext: 'In use · LLM integration, multi-provider router',
        status: 'In Use',
      },
      {
        name: 'Groq / Azure OpenAI',
        subtext: 'Building · Fallback router design',
        status: 'Building',
      },
    ],
  },
  {
    title: 'INFRASTRUCTURE & DATA',
    skills: [
      {
        name: 'PostgreSQL / SQL Server',
        subtext: 'Production · 3+ yrs · SERA, HDI, Maccon',
        status: 'Production-ready',
      },
      {
        name: 'Redis / BullMQ',
        subtext: 'Production · Queue-based async pipelines',
        status: 'Production-ready',
      },
      {
        name: 'Docker / Kubernetes',
        subtext: 'Production · Bare-metal K8s at Telkomsel',
        status: 'Production-ready',
      },
      {
        name: 'Azure (APIM, Service Bus, Key Vault)',
        subtext: 'Production · Enterprise integration at SERA',
        status: 'Production-ready',
      },
      {
        name: 'MongoDB',
        subtext: 'In use · SERA driver management system',
        status: 'In Use',
      },
    ],
  },
];

const projects = [
  {
    id: 'auraflow-ai',
    title: 'AuraFlow AI',
    subtitle: 'Distributed Async Enterprise Agent',
    category: 'Architecture',
    tags: ['Node.js', 'Python', 'LangGraph', 'Redis', 'BullMQ', 'PostgreSQL'],
    spineColor: 'bg-indigo-600',
    coverColor: 'bg-indigo-900',
    spineText: 'AURAFLOW-AI',
    date: '2026',
    demoUrl: 'https://example.com/demo',
    github: 'https://github.com/awaluddin-dev/auraflow-ai',
    stats: [
      { label: 'System Latency', value: '-35%' },
      { label: 'Processing Speed', value: '2.5x' },
      { label: 'Accuracy', value: '99.2%' },
    ],
    phases: [
      {
        date: 'Jan 2026',
        title: 'Requirements & Pipeline Architecture',
        description:
          'Designed the asynchronous event loop pipeline, BullMQ task orchestrator, and LangGraph multi-agent flow charts to map distributed roles.',
      },
      {
        date: 'Feb 2026',
        title: 'Gateway API & Redis Worker Setup',
        description:
          'Engineered high-performance Express API gateways in TypeScript and built scalable, fault-tolerant Redis queue consumers.',
      },
      {
        date: 'Mar 2026',
        title: 'Python AI Worker Integration',
        description:
          'Developed Python-based LangGraph micro-agents with strict input sanitization, parsing loops, and secure HTTP callback endpoints.',
      },
      {
        date: 'Apr 2026',
        title: 'PostgreSQL Sink & Load Testing',
        description:
          'Implemented transaction-safe PostgreSQL persistence layer with optimistic locking, and validated system integrity under stress testing.',
      },
    ],
    reasonToBuild:
      'I wanted to explore how autonomous agents can work together in a distributed microservices environment using modern tools like LangGraph and BullMQ.',
    problemSolved:
      'Resolves the bottleneck of manual data processing by automating unstructured data parsing, validation, and self-healing across a robust asynchronous event loop.',
    markdown: `
# AuraFlow AI
**Distributed Asynchronous Enterprise Agent & Worker Ecosystem**

AuraFlow AI is an active portfolio project that mirrors real enterprise problems I've solved regarding asynchronous data processing, compliance data cleaning, and queue-based architecture.

## Architecture Highlights
- **Gateway**: Node.js + TypeScript + Express + Inversify
- **Queue System**: Redis + BullMQ for robust background job handling
- **AI Worker**: Python + LangGraph + LLMs (Gemini/OpenAI)
- **Data Persistence**: PostgreSQL

### The Pipeline
1. **Ingestion**: Node.js API receives unstructured or malformed data.
2. **Queuing**: Job pushed to Redis queue via BullMQ.
3. **AI Processing**: Python LangGraph worker picks up the job.
   - *Agent 1 (Parser)*: Cleans raw/malformed data.
   - *Agent 2 (Validator)*: Validates the output. If invalid, it loops back to the parser.
4. **Callback**: Once validated, Python worker notifies Node.js via HTTP callback.
5. **Persistence**: Node.js saves final clean data to PostgreSQL.
`,
  },
  {
    id: 'ledgerflow',
    title: 'LedgerFlow',
    subtitle: 'Digital Wallet API',
    category: 'Fintech',
    tags: ['Go', 'Node.js', 'Redis', 'Concurrency'],
    spineColor: 'bg-emerald-600',
    coverColor: 'bg-emerald-900',
    spineText: 'LEDGERFLOW',
    date: '2024',
    demoUrl: 'https://example.com/demo',
    github: 'https://github.com/awaluddin-dev/ledgerflow',
    stats: [
      { label: 'Concurrency Safety', value: '100%' },
      { label: 'Avg Endpoint Latency', value: '<15ms' },
      { label: 'Peak Capacity', value: '5K+ tx/s' },
    ],
    phases: [
      {
        date: 'May 2024',
        title: 'Transaction Engine Spec',
        description:
          'Designed concurrent ledger architectures, mapped database constraints, and evaluated transaction isolation strategies (Pessimistic vs. Optimistic OCC).',
      },
      {
        date: 'Jun 2024',
        title: 'Go Ledger Core Implementation',
        description:
          'Wrote the core financial ledger service in Go, implementing thread-safe balance operations, optimistic concurrency checks, and atomic mutations.',
      },
      {
        date: 'Aug 2024',
        title: 'Redis Distributed Lock Setup',
        description:
          'Integrated Redis caching layers for instant wallet session authentication, anti-replay token validation, and distributed locks.',
      },
      {
        date: 'Oct 2024',
        title: 'High-Load Benchmarking',
        description:
          'Stress-tested core transaction pathways up to 5,000 requests per second, achieving sub-15ms endpoint latency while maintaining absolute race-condition safety.',
      },
    ],
    reasonToBuild:
      'I needed a solid demonstration of handling complex concurrent financial transactions efficiently without data races or locks holding up the system.',
    problemSolved:
      'Fixes common issues in digital wallet APIs, such as double-spending and slow throughput, by implementing Optimistic Concurrency Control (OCC) and atomic Redis mutations.',
    markdown: `
# LedgerFlow
**Digital Wallet API with Race Condition Prevention**

LedgerFlow is a high-performance digital wallet API built to handle concurrent financial transactions without data anomalies.

## Core Features
- **Optimistic Concurrency Control (OCC)**: Implemented to strictly prevent race conditions during concurrent balance updates.
- **In-Memory Caching**: Leveraged Redis for rapid session validation and idempotency key storage.
- **Security**: JWT-based authentication with strict payload validation.

### Technical Focus
The primary technical achievement is the robust handling of race conditions—a critical requirement in fintech—demonstrating a deep understanding of transactional integrity across distributed systems.
`,
  },
  {
    id: 'shelf-book-be',
    title: 'Shelf Book',
    subtitle: 'Dynamic Developer Portfolio Engine',
    category: 'Fullstack / Tooling',
    tags: ['NestJS', 'TypeScript', 'Prisma', 'PostgreSQL', 'Docker'],
    spineColor: 'bg-zinc-600',
    coverColor: 'bg-zinc-900',
    spineText: 'SHELF-BOOK',
    date: '2026',
    demoUrl: null,
    github: 'https://github.com/awaluddin-dev/shelf-book-be',
    stats: [
      { label: 'Data Tracking', value: '100%' },
      { label: 'Validation', value: 'Public' },
    ],
    phases: [
      {
        date: 'Jul 2026',
        title: 'Project Initiation & Schema Design',
        description:
          'Designed the core Prisma schema to act as the single source of truth for portfolio data, metrics, and progress tracking.',
      },
      {
        date: 'Jul 2026',
        title: 'API & Docker Setup',
        description:
          'Implemented the NestJS REST API and containerized the application with Docker for seamless production deployment.',
      },
    ],
    reasonToBuild:
      'I realized I was lacking in publishing my work and had no dedicated tools to monitor my own engineering progress.',
    problemSolved:
      'Provides a centralized platform to track activity, monitor what I have published, reflect on my progress, and serve as a public benchmark for recruiter validation and portfolio showcases.',
    markdown: `
# Shelf Book (Backend)
**Dynamic Developer Portfolio Engine**

Shelf Book is the backend engine powering my personal portfolio and developer metric tracking system.

## Core Features
- **Dynamic Seeding**: Uses Prisma to strictly sync database states with predefined configurations.
- **Progress Tracking**: Tracks skills, roadmaps, and project lifecycles to act as a benchmark for self-reflection.
- **Containerized**: Built with a multi-stage Dockerfile designed for robust production deployment.

### Why This Matters
This project serves as a public validation of my skills. Instead of just listing technologies on a static page, this backend actively tracks my activity and development roadmap, proving my commitment to continuous engineering growth.
`,
  },
];

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

console.log('DATABASE_URL is:', process.env.AIVEN_DATABASE_URL);
const connectionString = `${process.env.AIVEN_DATABASE_URL || process.env.DATABASE_URL}`;
const pgConnectionString = connectionString.replace('?sslmode=require', '');

let sslConfig: boolean | any = false;
if (process.env.DB_REQUIRE_SSL === 'true') {
  if (process.env.DATABASE_CA) {
    sslConfig = {
      rejectUnauthorized: true,
      ca: Buffer.from(process.env.DATABASE_CA, 'base64').toString('utf-8'),
    };
  } else if (process.env.CA_CERT_PATH) {
    const fs = require('fs');
    const path = require('path');
    const fullPath = path.resolve(process.cwd(), process.env.CA_CERT_PATH);
    if (fs.existsSync(fullPath)) {
      sslConfig = {
        rejectUnauthorized: true,
        ca: fs.readFileSync(fullPath).toString(),
      };
    }
  } else {
    sslConfig = { rejectUnauthorized: false };
  }
}

const pool = new Pool({
  connectionString: pgConnectionString,
  ssl: sslConfig,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const defaultSkillNodes = [
  // ── ZONA HIJAU: Core Backend ──────────────────────────────────────────────
  {
    id: 'nodejs',
    title: 'Node.js',
    category: 'Core Backend',
    level: 'Production · 3+ yrs',
    x: 80,
    y: 80,
    details:
      'High-concurrency event-driven runtime across SERA, Telkomsel, and HDI — event loop optimization, stream piping, ESM module resolution, and multi-core clustering.',
    connections: ['typescript', 'nestjs'],
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    category: 'Core Backend',
    level: 'Production · 3+ yrs',
    x: 80,
    y: 210,
    details:
      'Strict typing across all Node.js projects at SERA and HDI — DTO validation with class-validator, discriminated unions, generic service patterns, and interface-driven DI.',
    connections: ['nestjs'],
  },
  {
    id: 'nestjs',
    title: 'NestJS',
    category: 'Core Backend',
    level: 'Production · 2+ yrs',
    x: 80,
    y: 340,
    details:
      'Enterprise backend framework at SERA and HDI — Guards, Interceptors, custom decorators, DI containers, native microservice transporters, and monorepo setups.',
    connections: ['rest-api'],
  },
  {
    id: 'go',
    title: 'Go',
    category: 'Core Backend',
    level: 'Production · 1 yr',
    x: 220,
    y: 80,
    details:
      'IoT monitoring backend at Telkomsel — goroutine concurrency, channel patterns, lightweight stateless service handlers, gRPC endpoints, and bare-metal deployment.',
    connections: ['dist-systems'],
  },
  {
    id: 'dist-systems',
    title: 'Dist. Systems',
    category: 'Core Backend',
    level: 'Production · Enterprise',
    x: 220,
    y: 210,
    details:
      'Event-driven microservice architecture at SERA — fault-tolerant messaging, circuit breaker patterns, saga-based payroll data flows, and distributed state management.',
    connections: ['postgres', 'redis'],
  },
  {
    id: 'rest-api',
    title: 'REST API',
    category: 'Core Backend',
    level: 'Production · All roles',
    x: 220,
    y: 340,
    details:
      'REST API design across all engineering roles — versioning strategies, DTO contracts, standardized error responses, pagination patterns, and Swagger/OpenAPI documentation.',
    connections: ['dist-systems'],
  },

  // ── ZONA BIRU: Infrastructure ─────────────────────────────────────────────
  {
    id: 'postgres',
    title: 'PostgreSQL',
    category: 'Infrastructure',
    level: 'Production · 3+ yrs',
    x: 460,
    y: 80,
    details:
      'Primary database across HDI P2P lending, Maccon, and AuraFlow AI — advanced indexing (B-Tree, GIN), JSONB, recursive CTEs, OCC locking, and TypeORM migrations.',
    connections: ['redis'],
  },
  {
    id: 'redis',
    title: 'Redis',
    category: 'Infrastructure',
    level: 'Production · 2+ yrs',
    x: 460,
    y: 210,
    details:
      'Distributed caching and queue backbone — BullMQ job management in AuraFlow AI, Redlock distributed locks, Pub/Sub channels, and cache-aside invalidation strategies.',
    connections: ['bullmq'],
  },
  {
    id: 'bullmq',
    title: 'BullMQ',
    category: 'Infrastructure',
    level: 'In Use · AuraFlow',
    x: 460,
    y: 340,
    details:
      'Async job queue for AuraFlow AI pipeline — job prioritization, configurable retry policies, delayed execution, and concurrency control between Node.js gateway and Python worker.',
    connections: [],
  },
  {
    id: 'docker',
    title: 'Docker',
    category: 'Infrastructure',
    level: 'Production · 2+ yrs',
    x: 580,
    y: 80,
    details:
      'Containerization at Telkomsel and SERA — multi-stage builds, Compose for local dev environments, image layer optimization, and CI/CD environment parity via Jenkins.',
    connections: ['k8s'],
  },
  {
    id: 'k8s',
    title: 'Kubernetes',
    category: 'Infrastructure',
    level: 'Production · Telkomsel',
    x: 580,
    y: 210,
    details:
      'Bare-metal K8s cluster at Telkomsel — physical node provisioning, Helm chart management, Ingress routing rules, ConfigMap/Secret management, and ArgoCD GitOps sync.',
    connections: ['argocd'],
  },
  {
    id: 'argocd',
    title: 'ArgoCD',
    category: 'Infrastructure',
    level: 'Production · Telkomsel',
    x: 580,
    y: 340,
    details:
      'GitOps-based continuous deployment at Telkomsel — automated sync policies, environment-based rollback, promotion pipelines, and real-time application health monitoring.',
    connections: [],
  },
  {
    id: 'azure-servicebus',
    title: 'Azure Svc Bus',
    category: 'Infrastructure',
    level: 'Production · SERA',
    x: 700,
    y: 80,
    details:
      'Enterprise message broker at SERA — SAP and Mekari Talenta integration via topics/subscriptions, dead-letter queue handling, session-based ordering, and retry policies.',
    connections: ['azure-apim', 'python'],
  },
  {
    id: 'azure-apim',
    title: 'Azure APIM',
    category: 'Infrastructure',
    level: 'Production · SERA',
    x: 700,
    y: 340,
    details:
      'API management layer at SERA — policy-based authentication, rate limiting, request/response transformation, and backend abstraction for SAP and FMS 2.0 integrations.',
    connections: ['sap-integration'],
  },

  // ── ZONA UNGU: AI & Integrations ─────────────────────────────────────────
  {
    id: 'python',
    title: 'Python',
    category: 'AI & Integrations',
    level: 'In Use · AuraFlow',
    x: 880,
    y: 80,
    details:
      'AI worker runtime for AuraFlow — async scripting, Pydantic schema validation, structured logging (grep-friendly, no icons), and multi-threaded LangGraph agent execution.',
    connections: ['langgraph', 'langchain'],
  },
  {
    id: 'langchain',
    title: 'LangChain',
    category: 'AI & Integrations',
    level: 'In Use · AuraFlow',
    x: 880,
    y: 210,
    details:
      'Agent tooling and chain composition for AuraFlow — prompt templates, structured output parsers, memory management, and tool-calling integration with LLM providers.',
    connections: ['llm-router'],
  },
  {
    id: 'sap-integration',
    title: 'SAP Integration',
    category: 'AI & Integrations',
    level: 'Production · SERA',
    x: 880,
    y: 340,
    details:
      'Enterprise SAP payroll data sync at SERA — integration via Azure Service Bus, idempotent message processing, field mapping to internal driver schemas, and error recovery flows.',
    connections: ['mekari-talenta'],
  },
  {
    id: 'langgraph',
    title: 'LangGraph',
    category: 'AI & Integrations',
    level: 'Building · AuraFlow',
    x: 1030,
    y: 80,
    details:
      'Stateful multi-agent orchestration for AuraFlow AI — parse-validate loop with conditional branching, human-in-the-loop approval gates, and multi-provider LLM router integration.',
    connections: ['llm-router'],
  },
  {
    id: 'llm-router',
    title: 'LLM Router',
    category: 'AI & Integrations',
    level: 'Building · AuraFlow',
    x: 1030,
    y: 210,
    details:
      'Custom multi-provider abstraction layer for AuraFlow — sequential fallback across Claude, Gemini, OpenAI, Groq, and Azure OpenAI via environment-configurable LLM_PROVIDER_ORDER.',
    connections: ['claude-api'],
  },
  {
    id: 'mekari-talenta',
    title: 'Mekari Talenta',
    category: 'AI & Integrations',
    level: 'Production · SERA',
    x: 1030,
    y: 340,
    details:
      'HR and attendance data integration at SERA — webhook consumption, event-driven sync to driver management system, and reconciliation with SAP payroll outputs via Service Bus.',
    connections: [],
  },
  {
    id: 'claude-api',
    title: 'Claude / Gemini',
    category: 'AI & Integrations',
    level: 'In Use · AuraFlow',
    x: 1180,
    y: 80,
    details:
      'Primary LLM providers in AuraFlow router — structured JSON response parsing, multi-modal ingestion, token budget management, and retry-on-failure fallback to next provider.',
    connections: ['vectordb'],
  },
  {
    id: 'vectordb',
    title: 'pgvector',
    category: 'AI & Integrations',
    level: 'Building · Planned',
    x: 1180,
    y: 210,
    details:
      'Planned semantic search layer for AuraFlow RAG pipeline — pgvector extension on PostgreSQL, cosine similarity queries, embedding storage, and hybrid keyword+vector search.',
    connections: [],
  },
];

const currentFocusData = [
  {
    title: 'Writing',
    icon: 'PenTool',
    description:
      '"I Rewrote a Fintech Platform Alone — No Handover, No Team, No Docs"',
    link: 'https://dev.to/awaluddin',
    linkText: 'Read on dev.to',
  },
  {
    title: 'Current Work',
    icon: 'Code2',
    description:
      'Building AuraFlow AI, an intelligent project management and estimation agent.',
    link: 'https://github.com/awaluddin-dev',
    linkText: 'View Repository',
  },
  {
    title: 'Upcoming Tech',
    icon: 'Rocket',
    description:
      'Deep diving into local LLM orchestration and vector database optimization.',
    link: '#experience',
    linkText: 'See Roadmap',
  },
];

const roadmapItemsData = [
  {
    quarter: 'Q3 2026',
    title: 'Agentic Workflows & Cognitive Systems',
    tech: 'LangGraph & Stateful Agents',
    icon: 'BrainCircuit',
    description:
      'Currently in active development rather than a future plan. Focused on building stateful multi-agent systems and completing the AuraFlow project.',
    status: 'In Progress',
    depth: 'Architect Level',
    topics: [
      'Stateful Multi-Agent Graphs',
      'Human-in-the-loop Workflows',
      'Semantic Caching',
      'Self-Correcting RAG',
    ],
    projects: ['AuraFlow AI', 'Autonomous Agentic Pipeline'],
  },
  {
    quarter: 'Q4 2026',
    title: 'High-Concurrency Microservices',
    tech: 'Go & gRPC',
    icon: 'Code2',
    description:
      'Leveraging existing production experience. Deepening concurrency knowledge is more practical than learning a new language. Aligns with the SERA contract renewal evaluation in November.',
    status: 'Planned',
    depth: 'Advanced Practice',
    topics: [
      'Deepening Concurrency',
      'Advanced Goroutines Patterns',
      'gRPC & Protobuf',
      'Memory Profiling',
    ],
    projects: ['High-performance API Proxy', 'Concurrent Data Processor'],
  },
  {
    quarter: 'Q1 2027',
    title: 'Advanced Streaming & Event Architecture',
    tech: 'Apache Kafka / Event Sourcing',
    icon: 'Database',
    description:
      'The natural progression from my Azure Service Bus experience at SERA. Applying similar concepts to a new platform to stay highly relevant for enterprise remote roles.',
    status: 'Scheduled',
    depth: 'Intermediate Focus',
    topics: [
      'Partitioning & Consumer Groups',
      'Kafka Streams API',
      'Schema Registry',
      'Event Sourcing',
    ],
    projects: ['Real-time Event Logging Pipeline', 'Transactional Ledger'],
  },
  {
    quarter: 'Q2 2027',
    title: 'Systems & High-Performance Services',
    tech: 'Rust Backend (Axum/Tokio)',
    icon: 'Terminal',
    description:
      'Providing sufficient time for a proper deep dive once Kafka concepts are solidified. Building a foundational Rust backend that can be confidently defended in technical interviews.',
    status: 'Exploration Phase',
    depth: 'Intermediate Focus',
    topics: [
      'Ownership & Borrow Checker',
      'Tokio Async Runtime',
      'Axum Web Framework',
      'Memory Safety',
    ],
    projects: ['Rust HTTP API', 'WebAssembly Edge Services'],
  },
];

async function main() {
  console.log('Seeding database...');

  // 1. Seed Hero Config
  await prisma.heroConfig.upsert({
    where: { id: 'hero_1' },
    update: {
      expertise:
        'Async pipelines, event-driven architecture, and LLM integration for enterprise & fintech.',
      grit: 'Survived a solo OJK & BI regulatory audit as the only engineer. Moved from HVAC blueprints to production microservices in under 2 years.',
      service:
        "I don't just ship code — I reduce costs, cut vendors, and leave systems better than I found them.",
    },
    create: {
      id: 'hero_1',
      expertise:
        'Async pipelines, event-driven architecture, and LLM integration for enterprise & fintech.',
      grit: 'Survived a solo OJK & BI regulatory audit as the only engineer. Moved from HVAC blueprints to production microservices in under 2 years.',
      service:
        "I don't just ship code — I reduce costs, cut vendors, and leave systems better than I found them.",
    },
  });
  console.log('HeroConfig seeded.');

  // 2. Seed Metrics (Clean and Recreate)
  await prisma.metric.deleteMany({});
  await prisma.metric.createMany({
    data: [
      {
        id: 'm1',
        value: '5+ Years',
        label: 'Engineering Experience',
        icon: 'Code2',
        isSavings: false,
      },
      {
        id: 'm2',
        value: 'Enterprise & Fintech',
        label: 'INDUSTRY EXPERIENCE',
        icon: 'Briefcase',
        isSavings: false,
      },
      {
        id: 'm3',
        value: '$18K/yr',
        label: 'Infra Cost Savings',
        icon: 'TrendingUp',
        isSavings: true,
      },
      {
        id: 'm4',
        value: '@ Astra Group',
        label: 'CURRENT CONTRACT',
        icon: 'MapPin',
        isSavings: false,
      },
    ],
  });
  console.log('Metrics seeded.');

  // 3. Seed Skills (Clean and Recreate)
  await prisma.skill.deleteMany({});

  for (const node of defaultSkillNodes) {
    await prisma.skill.create({
      data: {
        id: node.id,
        title: node.title,
        category: node.category,
        level: node.level,
        details: node.details,
        x: node.x,
        y: node.y,
        connections: node.connections,
      },
    });
  }
  console.log('Skills seeded.');
  // --- EXPERIENCES ---
  await prisma.workExperience.deleteMany({
    where: { NOT: { id: { startsWith: 'exp-' } } },
  });
  for (const exp of experiencesList) {
    const id = 'exp-' + exp.company.toLowerCase().replace(/\W+/g, '-');
    await prisma.workExperience.upsert({
      where: { id },
      update: { ...exp },
      create: { id, ...exp },
    });
  }
  console.log('Work Experiences seeded.');

  // --- PROFICIENCIES ---
  await prisma.proficiency.deleteMany({
    where: { NOT: { id: { startsWith: 'prof-' } } },
  });
  
  // Clear child skills only for seeded proficiencies
  const seededProfIds = skillCategoriesList.map(
    (c) => 'prof-' + c.title.toLowerCase().replace(/\W+/g, '-'),
  );
  await prisma.proficiencySkill.deleteMany({
    where: { proficiencyId: { in: seededProfIds } },
  });

  for (const cat of skillCategoriesList) {
    const id = 'prof-' + cat.title.toLowerCase().replace(/\W+/g, '-');
    const data = { title: cat.title };
    await prisma.proficiency.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });

    // Create skills for this proficiency
    if (cat.skills) {
      await prisma.proficiencySkill.createMany({
        data: cat.skills.map((s) => ({
          proficiencyId: id,
          name: s.name,
          subtext: s.subtext,
          status: s.status,
        })),
      });
    }
  }
  console.log('Proficiencies seeded.');

  // --- PROJECTS ---
  for (const proj of projects) {
    const data = {
      title: proj.title,
      subtitle: proj.subtitle,
      category: proj.category,
      date: proj.date,
      tags: proj.tags,
      spineColor: proj.spineColor,
      coverColor: proj.coverColor,
      spineText: proj.spineText,
      github: proj.github || null,
      demoUrl: proj.demoUrl || null,
      stats: proj.stats || null,
      phases: proj.phases || null,
      markdown: proj.markdown || '',
      reasonToBuild: proj.reasonToBuild || null,
      problemSolved: proj.problemSolved || null,
    };
    await prisma.project.upsert({
      where: { id: proj.id },
      update: data,
      create: { id: proj.id, ...data },
    });
  }
  console.log('Projects seeded.');

  // 6. Seed Current Focus
  await prisma.currentFocus.deleteMany({
    where: { NOT: { id: { startsWith: 'focus-' } } },
  });
  for (const focus of currentFocusData) {
    const id = 'focus-' + focus.title.toLowerCase().replace(/\W+/g, '-');
    await prisma.currentFocus.upsert({
      where: { id },
      update: { ...focus },
      create: { id, ...focus },
    });
  }
  console.log('CurrentFocus seeded.');

  // 7. Seed Roadmap
  await prisma.roadmap.deleteMany({
    where: { NOT: { id: { startsWith: 'rm-' } } },
  });
  for (const item of roadmapItemsData) {
    const id = 'rm-' + item.tech.toLowerCase().replace(/\W+/g, '-');
    const { title, ...data } = item;
    await prisma.roadmap.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
  }
  console.log('Roadmap seeded.');

  // 8. Seed Visual Showcase
  await prisma.visualShowcase.deleteMany({
    where: { projectId: { in: projects.map((p) => p.id) } },
  });
  await prisma.visualShowcase.create({
    data: {
      projectId: 'auraflow-ai',
      imageUrl: '/assets/images/projects/auraflow/overview.jpg',
      caption: 'AuraFlow Main Dashboard and Real-time Telemetry',
      tag: 'OVERVIEW',
    },
  });
  console.log('Visual Showcase seeded.');

  // 9. Seed System Architecture
  await prisma.systemArchitecture.deleteMany({
    where: { projectId: { in: projects.map((p) => p.id) } },
  });
  await prisma.systemArchitecture.createMany({
    data: [
      {
        projectId: 'auraflow-ai',
        name: 'gateway',
        title: 'NestJS / Express API Gateway',
        description:
          'Ingests unstructured records, sanitizes payloads, and runs schema-level validation before dispatching to the queue.',
        metrics: 'Response: <12ms',
        order: 0,
      },
      {
        projectId: 'auraflow-ai',
        name: 'queue',
        title: 'Redis & BullMQ In-Memory Queue',
        description:
          'Provides fault tolerance and backpressure control. Buffers peak traffic to prevent downstream microservice exhaustion.',
        metrics: 'Capacity: 10K+ jobs/sec',
        order: 1,
      },
      {
        projectId: 'auraflow-ai',
        name: 'agents',
        title: 'LangGraph Multi-Agent Worker',
        description:
          'A cyclic stateful Python graph where Parser and Validator agents collaborate to parse, clean, and self-heal data anomalies.',
        metrics: 'Self-Heal Rate: 94.2%',
        order: 2,
      },
      {
        projectId: 'auraflow-ai',
        name: 'db',
        title: 'PostgreSQL Clean Storage',
        description:
          'Stores fully resolved, compliant, and structured documents with indexes optimized for semantic searches.',
        metrics: 'Uptime: 99.99%',
        order: 3,
      },
    ],
  });
  console.log('System Architecture seeded.');

  // 10. Seed Project Lifecycle
  await prisma.projectLifecycle.deleteMany({
    where: { projectId: { in: projects.map((p) => p.id) } },
  });
  for (const proj of projects) {
    if (proj.phases && proj.phases.length > 0) {
      for (let i = 0; i < proj.phases.length; i++) {
        const p = proj.phases[i];
        let stageName = 'Planning & Spec';
        if (i === 1) stageName = 'Architecture & Design';
        if (i === 2) stageName = 'Execution & Code';
        if (i >= 3) stageName = 'Testing & Launch';

        await prisma.projectLifecycle.create({
          data: {
            projectId: proj.id,
            stage: stageName,
            date: p.date,
            title: p.title,
            description: p.description,
            order: i,
          },
        });
      }
    }
  }
  console.log('Project Lifecycle seeded.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
