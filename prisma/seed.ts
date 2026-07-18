const experiencesList = [
  {
    years: "2025 - Present",
    duration: "Ongoing",
    company: "PT Serasi Autoraya (SERA)",
    role: "Backend Developer",
    stack: "Node.js & Go",
    teaser: "Real-time SAP & Azure Bus Sync",
    fullImpact: "Streamlined massive corporate log pipelines and payroll synchronizations with robust event-driven microservices.",
    bullets: [
      "Migrating legacy .NET Driver Management System to highly concurrent Node.js microservices.",
      "Integrating SAP, Mekari Talenta, and FMS 2.0 via Azure Service Bus for critical payroll and logistics data queues.",
      "Achieved sub-second data synchronization latencies under heavy event concurrency."
    ]
  },
  {
    years: "2024 - 2025",
    duration: "1 year",
    company: "Telkomsel (Vendor)",
    role: "Software Engineer",
    stack: "Kubernetes & IoT",
    teaser: "Slashed Cloud Costs by $20K+/yr",
    fullImpact: "Slashed server infrastructure spend by 90% while running a bulletproof bare-metal Kubernetes IoT pipeline.",
    bullets: [
      "Built and engineered bare-metal Kubernetes clusters with custom-tuned IoT monitoring layers.",
      "Saved between 1,800 to 2,500 USD per month by transitioning architecture away from managed public cloud providers.",
      "Maintained 99.99% system availability under intense device data packet polling."
    ]
  },
  {
    years: "2023 - 2024",
    duration: "1 year",
    company: "PT Hensel Davest Indonesia",
    role: "Full Stack Developer",
    stack: "Laravel & NestJS",
    teaser: "OJK & BI Regulatory Compliance",
    fullImpact: "Successfully achieved strict banking and lending regulatory approvals single-handedly under extreme deadlines.",
    bullets: [
      "Led solo compliance engineering to meet OJK & BI regulatory standards, securing active fintech licenses.",
      "Rewrote the core P2P lending Laravel monolith into modular NestJS microservices, achieving a 4x increase in API throughput.",
      "Designed secure database architectures safeguarding sensitive transaction records and personal financial data."
    ]
  },
  {
    years: "2022 - 2023",
    duration: "1 year",
    company: "PT Maccon Generasi Mandiri",
    role: "Full Stack Developer",
    stack: "Laravel, Vue & Postgres",
    teaser: "Eliminated Vendor Licensing Costs",
    fullImpact: "Rebuilt core proprietary vendor tools in-house, ensuring 100% intellectual property ownership and 0% vendor fees.",
    bullets: [
      "Reconstructed external vendor systems from scratch, saving substantial annual licensing and maintenance fees.",
      "Developed end-to-end database schemas and business logic for factory inventory, sales pipeline, and delivery tracking.",
      "Designed dynamic Vue.js frontends paired with PostgreSQL for real-time warehouse data visualization."
    ]
  }
];

const skillCategoriesList = [
  {
    title: "CORE BACKEND",
    skills: [
      {
        name: "Node.js / TypeScript",
        subtext: "Production · 3+ yrs · SERA, Telkomsel, HDI",
        status: "Production-ready"
      },
      {
        name: "NestJS",
        subtext: "Production · 2+ yrs · Microservices, SAP integration",
        status: "Production-ready"
      },
      {
        name: "Go",
        subtext: "Production · 1 yr · IoT monitoring system",
        status: "Production-ready"
      },
      {
        name: "REST API / Event-Driven",
        subtext: "Production · Applied across all roles",
        status: "Production-ready"
      },
      {
        name: "Python",
        subtext: "In use · LangGraph worker, scripting",
        status: "In Use"
      }
    ]
  },
  {
    title: "AI & AUTOMATION",
    skills: [
      {
        name: "LangGraph",
        subtext: "Building · AuraFlow AI project",
        status: "Building"
      },
      {
        name: "LangChain",
        subtext: "In use · Agent orchestration",
        status: "In Use"
      },
      {
        name: "OpenAI / Gemini API",
        subtext: "In use · LLM integration, multi-provider router",
        status: "In Use"
      },
      {
        name: "Groq / Azure OpenAI",
        subtext: "Building · Fallback router design",
        status: "Building"
      }
    ]
  },
  {
    title: "INFRASTRUCTURE & DATA",
    skills: [
      {
        name: "PostgreSQL / SQL Server",
        subtext: "Production · 3+ yrs · SERA, HDI, Maccon",
        status: "Production-ready"
      },
      {
        name: "Redis / BullMQ",
        subtext: "Production · Queue-based async pipelines",
        status: "Production-ready"
      },
      {
        name: "Docker / Kubernetes",
        subtext: "Production · Bare-metal K8s at Telkomsel",
        status: "Production-ready"
      },
      {
        name: "Azure (APIM, Service Bus, Key Vault)",
        subtext: "Production · Enterprise integration at SERA",
        status: "Production-ready"
      },
      {
        name: "MongoDB",
        subtext: "In use · SERA driver management system",
        status: "In Use"
      }
    ]
  }
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
    spineText: 'AURAFLOW-AI // DISTRIBUTED AGENT ECOSYSTEM',
    date: '2026',
    demoUrl: "https://example.com/demo",
    github: 'https://github.com/awaluddin-dev/auraflow-ai',
    stats: [
      { label: 'System Latency', value: '-35%' },
      { label: 'Processing Speed', value: '2.5x' },
      { label: 'Accuracy', value: '99.2%' }
    ],
    phases: [
      {
        date: 'Jan 2026',
        title: 'Requirements & Pipeline Architecture',
        description: 'Designed the asynchronous event loop pipeline, BullMQ task orchestrator, and LangGraph multi-agent flow charts to map distributed roles.'
      },
      {
        date: 'Feb 2026',
        title: 'Gateway API & Redis Worker Setup',
        description: 'Engineered high-performance Express API gateways in TypeScript and built scalable, fault-tolerant Redis queue consumers.'
      },
      {
        date: 'Mar 2026',
        title: 'Python AI Worker Integration',
        description: 'Developed Python-based LangGraph micro-agents with strict input sanitization, parsing loops, and secure HTTP callback endpoints.'
      },
      {
        date: 'Apr 2026',
        title: 'PostgreSQL Sink & Load Testing',
        description: 'Implemented transaction-safe PostgreSQL persistence layer with optimistic locking, and validated system integrity under stress testing.'
      }
    ],
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
`
  },
  {
    id: 'sera-migration',
    title: 'SERA Driver Management',
    subtitle: 'Legacy .NET to Node.js Microservices',
    category: 'Enterprise',
    tags: ['NestJS', 'Microservices', 'Azure', 'Kubernetes', 'MongoDB', 'SQL Server'],
    spineColor: 'bg-blue-600',
    coverColor: 'bg-blue-900',
    spineText: 'SERA // ENTERPRISE MICROSERVICES MIGRATION',
    date: '2025 - 2026',
    stats: [
      { label: 'Latency Reduction', value: '40%' },
      { label: 'Sync Reliability', value: '100%' },
      { label: 'Migration Cost Saved', value: 'Significant' }
    ],
    phases: [
      {
        date: 'Aug 2025',
        title: 'Legacy Domain Analysis',
        description: 'Audited the monolithic legacy C# .NET codebase, mapped out subdomain contexts, and defined strict interface boundaries for the new NestJS apps.'
      },
      {
        date: 'Oct 2025',
        title: 'Azure Infrastructure Setup',
        description: 'Configured secure environments using Azure APIM, Azure Key Vault, and set up the Azure Service Bus queues for event-driven message dispatching.'
      },
      {
        date: 'Dec 2025',
        title: 'NestJS Microservices Re-platforming',
        description: 'Developed Driver, Trips, and Payroll independent microservices in NestJS with robust schema validations and MongoDB/SQL Server interfaces.'
      },
      {
        date: 'Feb 2026',
        title: 'Enterprise Integration & ArgoCD CI/CD',
        description: 'Successfully integrated payroll channels with SAP and Mekari Talenta systems. Provisioned production pods in Kubernetes with automated ArgoCD pipelines.'
      }
    ],
    markdown: `
# PT Serasi Autoraya (SERA) - Astra Group
**Legacy Migration & Microservices Architecture**

At SERA, I am tasked with migrating a legacy .NET Driver Management System to a modern Node.js microservices architecture.

## Key Integrations & Tech Stack
- **Framework**: Node.js, NestJS, Express, Inversify
- **Cloud & DevOps**: Azure Service Bus, Azure APIM, Azure Key Vault, Docker, Kubernetes, ArgoCD, Jenkins, SonarQube
- **Databases**: SQL Server, MongoDB, Redis
- **Integrations**: SAP, Mekari Talenta, FMS 2.0 (via Azure Service Bus)

### Challenges Addressed
- Decoupling monolithic legacy logic into bounded microservices.
- Ensuring reliable event-driven data sync for payroll and logistics using Azure Service Bus.
- Managing strict enterprise access via Azure APIM and Key Vault.
`
  },
  {
    id: 'ledgerflow',
    title: 'LedgerFlow',
    subtitle: 'Digital Wallet API',
    category: 'Fintech',
    tags: ['Go', 'Node.js', 'Redis', 'Concurrency'],
    spineColor: 'bg-emerald-600',
    coverColor: 'bg-emerald-900',
    spineText: 'LEDGERFLOW // WALLET API & OCC',
    date: '2024',
    demoUrl: "https://example.com/demo",
    github: 'https://github.com/awaluddin-dev/ledgerflow',
    stats: [
      { label: 'Concurrency Safety', value: '100%' },
      { label: 'Avg Endpoint Latency', value: '<15ms' },
      { label: 'Peak Capacity', value: '5K+ tx/s' }
    ],
    phases: [
      {
        date: 'May 2024',
        title: 'Transaction Engine Spec',
        description: 'Designed concurrent ledger architectures, mapped database constraints, and evaluated transaction isolation strategies (Pessimistic vs. Optimistic OCC).'
      },
      {
        date: 'Jun 2024',
        title: 'Go Ledger Core Implementation',
        description: 'Wrote the core financial ledger service in Go, implementing thread-safe balance operations, optimistic concurrency checks, and atomic mutations.'
      },
      {
        date: 'Aug 2024',
        title: 'Redis Distributed Lock Setup',
        description: 'Integrated Redis caching layers for instant wallet session authentication, anti-replay token validation, and distributed locks.'
      },
      {
        date: 'Oct 2024',
        title: 'High-Load Benchmarking',
        description: 'Stress-tested core transaction pathways up to 5,000 requests per second, achieving sub-15ms endpoint latency while maintaining absolute race-condition safety.'
      }
    ],
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
`
  },
  {
    id: 'telkomsel-iot',
    title: 'Telkomsel IoT Monitor',
    subtitle: 'Bare-metal Kubernetes',
    category: 'Infrastructure',
    tags: ['Kubernetes', 'IoT', 'Bare-metal'],
    spineColor: 'bg-orange-600',
    coverColor: 'bg-orange-900',
    spineText: 'TELKOMSEL // BARE-METAL K8S & IOT',
    date: '2024',
    demoUrl: "https://example.com/demo",
    github: 'https://github.com/awaluddin-dev/telkomsel-iot-monitor',
    stats: [
      { label: 'Monthly Cost Saved', value: '$1.8K-$2.5K' },
      { label: 'Server Cost Cut', value: '70%' },
      { label: 'Ingestion Uptime', value: '99.99%' }
    ],
    phases: [
      {
        date: 'Jan 2024',
        title: 'Bare-Metal Cluster Planning',
        description: 'Drafted physical network layout, mapped CPU/RAM limits, and developed custom scheduling requirements for continuous, high-volume IoT signals.'
      },
      {
        date: 'Mar 2024',
        title: 'Kubernetes Cluster Provisioning',
        description: 'Orchestrated on-premise physical servers into a reliable, self-managed Kubernetes cluster, tuning container runtimes and node allocations.'
      },
      {
        date: 'May 2024',
        title: 'Fault-Tolerance & PV Setup',
        description: 'Configured resilient local Persistent Volume provisions, data ingestion retry buffers, and automated scheduling failover rules.'
      },
      {
        date: 'Jul 2024',
        title: 'Optimized Ingestion Migration',
        description: 'Successfully migrated live IoT metric pipelines to bare-metal pods, maintaining 99.99% uptime while slashing cloud infrastructure costs by up to 70%.'
      }
    ],
    markdown: `
# Telkomsel IoT Monitoring
**Bare-metal Kubernetes Deployment**

Built and deployed an on-premise, bare-metal Kubernetes cluster tailored for an IoT monitoring system.

## Impact & Architecture
- **Cost Reduction**: Re-architecting from managed cloud to a bare-metal setup saved the client $1,800–$2,500 monthly.
- **High Availability**: Configured robust node scheduling and self-healing for continuous IoT metric ingestion.
- **Performance**: Tuned for high-throughput, low-latency sensor data processing.
`
  },
  {
    id: 'doeku-p2p',
    title: 'Doeku P2P Lending',
    subtitle: 'Monolith to Microservices',
    category: 'Fintech',
    tags: ['NestJS', 'Laravel', 'Compliance'],
    spineColor: 'bg-rose-600',
    coverColor: 'bg-rose-900',
    spineText: 'DOEKU // OJK COMPLIANCE & MICROSERVICES',
    date: '2023 - 2024',
    demoUrl: "https://example.com/demo",
    github: 'https://github.com/awaluddin-dev/doeku-p2p-lending',
    stats: [
      { label: 'Endpoint Latency', value: '-45%' },
      { label: 'OJK Audit Findings', value: '0 Critical' },
      { label: 'Disbursement Queue', value: 'BullMQ' }
    ],
    phases: [
      {
        date: 'Mar 2023',
        title: 'Laravel Monolith Audit',
        description: 'Dissected legacy PHP modules, extracted accounting and identity scopes, and laid down OJK regulatory database schema blueprints.'
      },
      {
        date: 'Jun 2023',
        title: 'NestJS Microservices Setup',
        description: 'Re-platformed central accounting ledger, disbursement mechanisms, and user profile domains as independent NestJS services.'
      },
      {
        date: 'Sep 2023',
        title: 'BullMQ & Redis Background Workers',
        description: 'Set up resilient background queues in Redis with BullMQ to asynchronously process OJK report compiles and multi-party loan disbursement payouts.'
      },
      {
        date: 'Dec 2023',
        title: 'OJK Compliance & Audit Success',
        description: 'Engineered strict schema DTO validations and automated auditing ledger logging. Passed the comprehensive regulatory audits with zero findings.'
      }
    ],
    markdown: `
# Doeku P2P Lending
**Solo Architecture Rewrite & Compliance**

As a solo developer, I led the complete architectural rewrite of a P2P lending platform, migrating it from a legacy Laravel monolith to scalable NestJS microservices.

## The Problem
The legacy Laravel monolith was suffering from performance bottlenecks and tight coupling, making it incredibly difficult to implement new compliance rules mandated by OJK (Financial Services Authority) and Bank Indonesia (BI). Adding new features often broke existing transaction logic, and the company was facing an impending regulatory audit.

## Architectural Decisions & Why
- **Migration to NestJS**: Chose NestJS for its modularity and robust dependency injection, which allowed me to neatly separate domains (Identity, Ledger, Core Lending) that were previously entangled in Laravel.
- **Event-Driven Microservices**: Used a message queue (BullMQ/Redis) for asynchronous tasks like sending loan disbursements and notifying users, ensuring that core API endpoints remained highly responsive.
- **Strict Data Validation**: Implemented strict DTOs and validation pipes. This wasn't just for clean code—it was a regulatory necessity to ensure no malformed financial data could enter the system.

## Trade-offs Considered
- **Complexity vs. Speed**: Moving to microservices increased deployment complexity. Since I was a solo developer, I had to automate CI/CD heavily to compensate. A modular monolith was considered, but strict isolation was required by the audit team for the transaction ledger.

## The Results
- **Zero-Downtime Audit Success**: Engineered the entire system to pass strict regulatory audits by OJK and BI with zero critical findings.
- **Performance**: Reduced average endpoint latency by 45%.
- **Reliability**: Introduced robust error handling and tamper-proof audit trails, essential for financial compliance.
`
  }
];

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pgConnectionString = connectionString.replace('?sslmode=require', '');
const pool = new Pool({ 
  connectionString: pgConnectionString, 
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const defaultSkillNodes = [
  // ── ZONA HIJAU: Core Backend ──────────────────────────────────────────────
  {
    id: "nodejs",
    title: "Node.js",
    category: "Core Backend",
    level: "Production · 3+ yrs",
    x: 80,
    y: 80,
    details:
      "High-concurrency event-driven runtime across SERA, Telkomsel, and HDI — event loop optimization, stream piping, ESM module resolution, and multi-core clustering.",
    connections: ["typescript", "nestjs"],
  },
  {
    id: "typescript",
    title: "TypeScript",
    category: "Core Backend",
    level: "Production · 3+ yrs",
    x: 80,
    y: 210,
    details:
      "Strict typing across all Node.js projects at SERA and HDI — DTO validation with class-validator, discriminated unions, generic service patterns, and interface-driven DI.",
    connections: ["nestjs"],
  },
  {
    id: "nestjs",
    title: "NestJS",
    category: "Core Backend",
    level: "Production · 2+ yrs",
    x: 80,
    y: 340,
    details:
      "Enterprise backend framework at SERA and HDI — Guards, Interceptors, custom decorators, DI containers, native microservice transporters, and monorepo setups.",
    connections: ["rest-api"],
  },
  {
    id: "go",
    title: "Go",
    category: "Core Backend",
    level: "Production · 1 yr",
    x: 220,
    y: 80,
    details:
      "IoT monitoring backend at Telkomsel — goroutine concurrency, channel patterns, lightweight stateless service handlers, gRPC endpoints, and bare-metal deployment.",
    connections: ["dist-systems"],
  },
  {
    id: "dist-systems",
    title: "Dist. Systems",
    category: "Core Backend",
    level: "Production · Enterprise",
    x: 220,
    y: 210,
    details:
      "Event-driven microservice architecture at SERA — fault-tolerant messaging, circuit breaker patterns, saga-based payroll data flows, and distributed state management.",
    connections: ["postgres", "redis"],
  },
  {
    id: "rest-api",
    title: "REST API",
    category: "Core Backend",
    level: "Production · All roles",
    x: 220,
    y: 340,
    details:
      "REST API design across all engineering roles — versioning strategies, DTO contracts, standardized error responses, pagination patterns, and Swagger/OpenAPI documentation.",
    connections: ["dist-systems"],
  },

  // ── ZONA BIRU: Infrastructure ─────────────────────────────────────────────
  {
    id: "postgres",
    title: "PostgreSQL",
    category: "Infrastructure",
    level: "Production · 3+ yrs",
    x: 460,
    y: 80,
    details:
      "Primary database across HDI P2P lending, Maccon, and AuraFlow AI — advanced indexing (B-Tree, GIN), JSONB, recursive CTEs, OCC locking, and TypeORM migrations.",
    connections: ["redis"],
  },
  {
    id: "redis",
    title: "Redis",
    category: "Infrastructure",
    level: "Production · 2+ yrs",
    x: 460,
    y: 210,
    details:
      "Distributed caching and queue backbone — BullMQ job management in AuraFlow AI, Redlock distributed locks, Pub/Sub channels, and cache-aside invalidation strategies.",
    connections: ["bullmq"],
  },
  {
    id: "bullmq",
    title: "BullMQ",
    category: "Infrastructure",
    level: "In Use · AuraFlow",
    x: 460,
    y: 340,
    details:
      "Async job queue for AuraFlow AI pipeline — job prioritization, configurable retry policies, delayed execution, and concurrency control between Node.js gateway and Python worker.",
    connections: [],
  },
  {
    id: "docker",
    title: "Docker",
    category: "Infrastructure",
    level: "Production · 2+ yrs",
    x: 580,
    y: 80,
    details:
      "Containerization at Telkomsel and SERA — multi-stage builds, Compose for local dev environments, image layer optimization, and CI/CD environment parity via Jenkins.",
    connections: ["k8s"],
  },
  {
    id: "k8s",
    title: "Kubernetes",
    category: "Infrastructure",
    level: "Production · Telkomsel",
    x: 580,
    y: 210,
    details:
      "Bare-metal K8s cluster at Telkomsel — physical node provisioning, Helm chart management, Ingress routing rules, ConfigMap/Secret management, and ArgoCD GitOps sync.",
    connections: ["argocd"],
  },
  {
    id: "argocd",
    title: "ArgoCD",
    category: "Infrastructure",
    level: "Production · Telkomsel",
    x: 580,
    y: 340,
    details:
      "GitOps-based continuous deployment at Telkomsel — automated sync policies, environment-based rollback, promotion pipelines, and real-time application health monitoring.",
    connections: [],
  },
  {
    id: "azure-servicebus",
    title: "Azure Svc Bus",
    category: "Infrastructure",
    level: "Production · SERA",
    x: 700,
    y: 80,
    details:
      "Enterprise message broker at SERA — SAP and Mekari Talenta integration via topics/subscriptions, dead-letter queue handling, session-based ordering, and retry policies.",
    connections: ["azure-apim", "python"],
  },
  {
    id: "azure-apim",
    title: "Azure APIM",
    category: "Infrastructure",
    level: "Production · SERA",
    x: 700,
    y: 340,
    details:
      "API management layer at SERA — policy-based authentication, rate limiting, request/response transformation, and backend abstraction for SAP and FMS 2.0 integrations.",
    connections: ["sap-integration"],
  },

  // ── ZONA UNGU: AI & Integrations ─────────────────────────────────────────
  {
    id: "python",
    title: "Python",
    category: "AI & Integrations",
    level: "In Use · AuraFlow",
    x: 880,
    y: 80,
    details:
      "AI worker runtime for AuraFlow — async scripting, Pydantic schema validation, structured logging (grep-friendly, no icons), and multi-threaded LangGraph agent execution.",
    connections: ["langgraph", "langchain"],
  },
  {
    id: "langchain",
    title: "LangChain",
    category: "AI & Integrations",
    level: "In Use · AuraFlow",
    x: 880,
    y: 210,
    details:
      "Agent tooling and chain composition for AuraFlow — prompt templates, structured output parsers, memory management, and tool-calling integration with LLM providers.",
    connections: ["llm-router"],
  },
  {
    id: "sap-integration",
    title: "SAP Integration",
    category: "AI & Integrations",
    level: "Production · SERA",
    x: 880,
    y: 340,
    details:
      "Enterprise SAP payroll data sync at SERA — integration via Azure Service Bus, idempotent message processing, field mapping to internal driver schemas, and error recovery flows.",
    connections: ["mekari-talenta"],
  },
  {
    id: "langgraph",
    title: "LangGraph",
    category: "AI & Integrations",
    level: "Building · AuraFlow",
    x: 1030,
    y: 80,
    details:
      "Stateful multi-agent orchestration for AuraFlow AI — parse-validate loop with conditional branching, human-in-the-loop approval gates, and multi-provider LLM router integration.",
    connections: ["llm-router"],
  },
  {
    id: "llm-router",
    title: "LLM Router",
    category: "AI & Integrations",
    level: "Building · AuraFlow",
    x: 1030,
    y: 210,
    details:
      "Custom multi-provider abstraction layer for AuraFlow — sequential fallback across Claude, Gemini, OpenAI, Groq, and Azure OpenAI via environment-configurable LLM_PROVIDER_ORDER.",
    connections: ["claude-api"],
  },
  {
    id: "mekari-talenta",
    title: "Mekari Talenta",
    category: "AI & Integrations",
    level: "Production · SERA",
    x: 1030,
    y: 340,
    details:
      "HR and attendance data integration at SERA — webhook consumption, event-driven sync to driver management system, and reconciliation with SAP payroll outputs via Service Bus.",
    connections: [],
  },
  {
    id: "claude-api",
    title: "Claude / Gemini",
    category: "AI & Integrations",
    level: "In Use · AuraFlow",
    x: 1180,
    y: 80,
    details:
      "Primary LLM providers in AuraFlow router — structured JSON response parsing, multi-modal ingestion, token budget management, and retry-on-failure fallback to next provider.",
    connections: ["vectordb"],
  },
  {
    id: "vectordb",
    title: "pgvector",
    category: "AI & Integrations",
    level: "Building · Planned",
    x: 1180,
    y: 210,
    details:
      "Planned semantic search layer for AuraFlow RAG pipeline — pgvector extension on PostgreSQL, cosine similarity queries, embedding storage, and hybrid keyword+vector search.",
    connections: [],
  },
];

const currentFocusData = [
  {
    title: "Writing",
    icon: "PenTool",
    description: '"I Rewrote a Fintech Platform Alone — No Handover, No Team, No Docs"',
    link: "https://dev.to/awaluddin",
    linkText: "Read on dev.to",
  },
  {
    title: "Current Work",
    icon: "Code2",
    description: "Building AuraFlow AI, an intelligent project management and estimation agent.",
    link: "https://github.com/awaluddin-dev",
    linkText: "View Repository",
  },
  {
    title: "Upcoming Tech",
    icon: "Rocket",
    description: "Deep diving into local LLM orchestration and vector database optimization.",
    link: "#experience",
    linkText: "See Roadmap",
  },
];

const roadmapItemsData = [
  {
    quarter: 'Q3 2026',
    title: 'Systems & High-Performance Services',
    tech: 'Rust & WebAssembly',
    icon: 'Code2',
    description: 'Transitioning performance-critical modules to memory-safe systems programming to design ultra-low latency WebAssembly edge services.',
    status: 'Plan Formulated',
    depth: 'Intermediate Focus',
    topics: ['Ownership & Borrow Checker', 'Tokio Async Runtime', 'WASM Edge Handlers', 'Zero-cost Abstractions'],
    projects: ['WASM-based HTTP Request Filter', 'High-performance API Proxy in Rust']
  },
  {
    quarter: 'Q4 2026',
    title: 'Advanced Streaming & Event Architecture',
    tech: 'Apache Kafka & Event Sourcing',
    icon: 'Database',
    description: 'Building robust, multi-region distributed streaming architectures with strict event ordering, transaction support, and message guarantees.',
    status: 'Scheduled',
    depth: 'Advanced Practice',
    topics: ['Partitioning & Consumer Groups', 'Kafka Streams API', 'Schema Registry & Avro', 'Idempotent Producers'],
    projects: ['Real-time Event Logging Pipeline', 'Transactional Event-Sourced Ledger']
  },
  {
    quarter: 'Q1 2027',
    title: 'Agentic Workflows & Cognitive Systems',
    tech: 'LangGraph & Stateful Agents',
    icon: 'BrainCircuit',
    description: 'Evolving LLM integrations from standard RAG pipelines into autonomous stateful multi-agent systems that learn and adapt with memory.',
    status: 'Research Phase',
    depth: 'Architect Level',
    topics: ['Stateful Multi-Agent Graphs', 'Human-in-the-loop Workflows', 'Semantic Caching & Memory', 'Self-Correcting RAG'],
    projects: ['Autonomous PR Reviewer Agent', 'Self-Improving Code Interpreter Engine']
  },
  {
    quarter: 'Q2 2027',
    title: 'Edge-Native WebAssembly Serverless',
    tech: 'Wasmtime & Spin Runtime',
    icon: 'Globe',
    description: 'Leveraging WebAssembly System Interface (WASI) and modular compilation to deploy sandboxed, lightning-fast edge-native serverless functions.',
    status: 'Exploration Phase',
    depth: 'Intermediate Focus',
    topics: ['WASI Preview 2', 'Component Model Architecture', 'Spin Serverless Framework', 'Secure Sandbox Environments'],
    projects: ['Edge-Deployed GeoIP Middleware', 'Instant-boot Sandbox Function Orchestrator']
  }
];

async function main() {
  console.log('Seeding database...');

  // 1. Seed Hero Config
  await prisma.heroConfig.upsert({
    where: { id: "hero_1" },
    update: {
      expertise: "Async pipelines, event-driven architecture, and LLM integration for enterprise & fintech.",
      grit: "Survived a solo OJK & BI regulatory audit as the only engineer. Moved from HVAC blueprints to production microservices in under 2 years.",
      service: "I don't just ship code — I reduce costs, cut vendors, and leave systems better than I found them."
    },
    create: {
      id: "hero_1",
      expertise: "Async pipelines, event-driven architecture, and LLM integration for enterprise & fintech.",
      grit: "Survived a solo OJK & BI regulatory audit as the only engineer. Moved from HVAC blueprints to production microservices in under 2 years.",
      service: "I don't just ship code — I reduce costs, cut vendors, and leave systems better than I found them."
    }
  });
  console.log('HeroConfig seeded.');

  // 2. Seed Metrics (Clean and Recreate)
  await prisma.metric.deleteMany({});
  await prisma.metric.createMany({
    data: [
      { id: 'm1', value: "5+ Years", label: "Engineering Experience", icon: "Code2", isSavings: false },
      { id: 'm2', value: "Enterprise & Fintech", label: "INDUSTRY EXPERIENCE", icon: "Briefcase", isSavings: false },
      { id: 'm3', value: "$18K/yr", label: "Infra Cost Savings", icon: "TrendingUp", isSavings: true },
      { id: 'm4', value: "@ Astra Group", label: "CURRENT CONTRACT", icon: "MapPin", isSavings: false },
    ]
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
        connections: node.connections
      }
    });
  }
  console.log('Skills seeded.');
  // --- EXPERIENCES ---
  await prisma.workExperience.deleteMany({});
  for (const exp of experiencesList) {
    await prisma.workExperience.create({
      data: {
        years: exp.years,
        duration: exp.duration,
        company: exp.company,
        role: exp.role,
        stack: exp.stack,
        teaser: exp.teaser,
        fullImpact: exp.fullImpact,
        bullets: exp.bullets
      }
    });
  }
  console.log('Work Experiences seeded.');

  // --- PROFICIENCIES ---
  await prisma.proficiencySkill.deleteMany({});
  await prisma.proficiency.deleteMany({});
  for (const cat of skillCategoriesList) {
    await prisma.proficiency.create({
      data: {
        title: cat.title,
        skills: {
          create: cat.skills.map(s => ({
            name: s.name,
            subtext: s.subtext,
            status: s.status
          }))
        }
      }
    });
  }
  console.log('Proficiencies seeded.');

  // --- PROJECTS ---
  await prisma.project.deleteMany({});
  for (const proj of projects) {
    await prisma.project.create({
      data: {
        id: proj.id,
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
        markdown: proj.markdown || ''
      }
    });
  }
  console.log('Projects seeded.');

  // 6. Seed Current Focus
  await prisma.currentFocus.deleteMany({});
  for (const focus of currentFocusData) {
    await prisma.currentFocus.create({
      data: {
        title: focus.title,
        icon: focus.icon,
        description: focus.description,
        link: focus.link,
        linkText: focus.linkText
      }
    });
  }
  console.log('CurrentFocus seeded.');

  // 7. Seed Roadmap
  await prisma.roadmap.deleteMany({});
  for (const item of roadmapItemsData) {
    await prisma.roadmap.create({
      data: {
        tech: item.tech,
        quarter: item.quarter,
        status: item.status,
        icon: item.icon,
        description: item.description,
        depth: item.depth,
        topics: item.topics,
        projects: item.projects
      }
    });
  }
  console.log('Roadmap seeded.');

  // 8. Seed Visual Showcase
  await prisma.visualShowcase.deleteMany({});
  await prisma.visualShowcase.create({
    data: {
      projectId: 'auraflow-ai',
      imageUrl: '/assets/images/projects/auraflow/overview.jpg',
      caption: 'AuraFlow Main Dashboard and Real-time Telemetry',
      tag: 'OVERVIEW'
    }
  });
  console.log('Visual Showcase seeded.');

  // 9. Seed System Architecture
  await prisma.systemArchitecture.deleteMany({});
  await prisma.systemArchitecture.createMany({
    data: [
      {
        projectId: 'auraflow-ai',
        name: 'gateway',
        title: 'NestJS / Express API Gateway',
        description: 'Ingests unstructured records, sanitizes payloads, and runs schema-level validation before dispatching to the queue.',
        metrics: 'Response: <12ms',
        order: 0
      },
      {
        projectId: 'auraflow-ai',
        name: 'queue',
        title: 'Redis & BullMQ In-Memory Queue',
        description: 'Provides fault tolerance and backpressure control. Buffers peak traffic to prevent downstream microservice exhaustion.',
        metrics: 'Capacity: 10K+ jobs/sec',
        order: 1
      },
      {
        projectId: 'auraflow-ai',
        name: 'agents',
        title: 'LangGraph Multi-Agent Worker',
        description: 'A cyclic stateful Python graph where Parser and Validator agents collaborate to parse, clean, and self-heal data anomalies.',
        metrics: 'Self-Heal Rate: 94.2%',
        order: 2
      },
      {
        projectId: 'auraflow-ai',
        name: 'db',
        title: 'PostgreSQL Clean Storage',
        description: 'Stores fully resolved, compliant, and structured documents with indexes optimized for semantic searches.',
        metrics: 'Uptime: 99.99%',
        order: 3
      }
    ]
  });
  console.log('System Architecture seeded.');

  // 10. Seed Project Lifecycle
  await prisma.projectLifecycle.deleteMany({});
  for (const proj of projects) {
    if (proj.phases && proj.phases.length > 0) {
      for (let i = 0; i < proj.phases.length; i++) {
        const p = proj.phases[i];
        let stageName = "Planning & Spec";
        if (i === 1) stageName = "Architecture & Design";
        if (i === 2) stageName = "Execution & Code";
        if (i >= 3) stageName = "Testing & Launch";

        await prisma.projectLifecycle.create({
          data: {
            projectId: proj.id,
            stage: stageName,
            date: p.date,
            title: p.title,
            description: p.description,
            order: i
          }
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
