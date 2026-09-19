import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateDirectionV2Dto,
  UpdateDirectionV2Dto,
  CreateYouTubeVideoV2Dto,
  UpdateYouTubeVideoV2Dto,
} from './directions-v2.dto';

export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  coverImage?: string;
  socialImage?: string;
  publishedAt: string;
  readablePublishDate: string;
  readingTimeMinutes: number;
  tagList: string[];
  publicReactionsCount: number;
  commentsCount: number;
}

@Injectable()
export class DirectionsV2Service {
  private readonly logger = new Logger(DirectionsV2Service.name);
  private devToCache: { timestamp: number; data: DevToArticle[] } | null = null;
  private readonly CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // DIRECTIONS CRUD
  // ---------------------------------------------------------------------------
  async findAll(type?: string) {
    const where = type ? { type } : {};
    return await this.prisma.directionV2.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findGrouped() {
    const all = await this.findAll();
    const current = all.filter((d) => d.type === 'current');
    const future = all.filter((d) => d.type === 'future');

    // Group future by quarter
    const roadmapByQuarter: Record<string, typeof all> = {};
    for (const item of future) {
      if (!roadmapByQuarter[item.quarter]) {
        roadmapByQuarter[item.quarter] = [];
      }
      roadmapByQuarter[item.quarter].push(item);
    }

    return {
      current,
      future,
      roadmapByQuarter,
    };
  }

  async findOne(id: string) {
    const item = await this.prisma.directionV2.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Direction item with id ${id} not found`);
    }
    return item;
  }

  async create(dto: CreateDirectionV2Dto) {
    return await this.prisma.directionV2.create({
      data: {
        title: dto.title,
        category: dto.category,
        type: dto.type,
        quarter: dto.quarter,
        status: dto.status ?? 'in_progress',
        description: dto.description,
        depth: dto.depth,
        tags: dto.tags ?? [],
        icon: dto.icon,
        link: dto.link,
        linkText: dto.linkText,
        order: dto.order ?? 0,
      },
    });
  }

  async update(id: string, dto: UpdateDirectionV2Dto) {
    await this.findOne(id);
    return await this.prisma.directionV2.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.quarter !== undefined && { quarter: dto.quarter }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.depth !== undefined && { depth: dto.depth }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.icon !== undefined && { icon: dto.icon }),
        ...(dto.link !== undefined && { link: dto.link }),
        ...(dto.linkText !== undefined && { linkText: dto.linkText }),
        ...(dto.order !== undefined && { order: dto.order }),
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return await this.prisma.directionV2.delete({ where: { id } });
  }

  // ---------------------------------------------------------------------------
  // DEV.TO ARTICLES INTEGRATION
  // ---------------------------------------------------------------------------
  async getDevToArticles(username = 'awaluddin'): Promise<DevToArticle[]> {
    const now = Date.now();
    if (
      this.devToCache &&
      now - this.devToCache.timestamp < this.CACHE_TTL_MS
    ) {
      return this.devToCache.data.slice(0, 2);
    }

    try {
      const response = await fetch(
        `https://dev.to/api/articles?username=${username}&per_page=6`,
        {
          headers: {
            'User-Agent': 'AwaluddinPortfolio/2.0',
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Dev.to API responded with status ${response.status}`);
      }

      const rawArticles = (await response.json()) as unknown;
      if (!Array.isArray(rawArticles)) {
        return [];
      }

      interface RawDevToArticle {
        id: number;
        title: string;
        description: string;
        url: string;
        cover_image?: string;
        social_image?: string;
        published_at: string;
        readable_publish_date: string;
        reading_time_minutes: number;
        tag_list?: string[];
        public_reactions_count?: number;
        comments_count?: number;
      }

      const articles: DevToArticle[] = (rawArticles as RawDevToArticle[]).map(
        (art) => ({
          id: art.id,
          title: art.title,
          description: art.description,
          url: art.url,
          coverImage: art.cover_image || art.social_image,
          socialImage: art.social_image,
          publishedAt: art.published_at,
          readablePublishDate: art.readable_publish_date,
          readingTimeMinutes: art.reading_time_minutes,
          tagList: art.tag_list || [],
          publicReactionsCount: art.public_reactions_count || 0,
          commentsCount: art.comments_count || 0,
        }),
      );

      this.devToCache = { timestamp: now, data: articles };
      return articles.slice(0, 2);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.warn(`Failed to fetch dev.to articles: ${errorMessage}`);
      if (this.devToCache) return this.devToCache.data.slice(0, 2);
      return [];
    }
  }

  // ---------------------------------------------------------------------------
  // YOUTUBE VIDEOS INTEGRATION & CRUD
  // ---------------------------------------------------------------------------
  async getYouTubeVideos() {
    // Only return data from the database, max 2 videos (featured / latest)
    return await this.prisma.youTubeVideoV2.findMany({
      take: 2,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async createYouTubeVideo(dto: CreateYouTubeVideoV2Dto) {
    return await this.prisma.youTubeVideoV2.create({
      data: {
        title: dto.title,
        description: dto.description ?? '',
        thumbnailUrl: dto.thumbnailUrl ?? '',
        videoUrl: dto.videoUrl,
        duration: dto.duration,
        views: dto.views,
        publishedAt: dto.publishedAt,
        order: dto.order ?? 0,
      },
    });
  }

  async updateYouTubeVideo(id: string, dto: UpdateYouTubeVideoV2Dto) {
    return await this.prisma.youTubeVideoV2.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.thumbnailUrl !== undefined && {
          thumbnailUrl: dto.thumbnailUrl,
        }),
        ...(dto.videoUrl !== undefined && { videoUrl: dto.videoUrl }),
        ...(dto.duration !== undefined && { duration: dto.duration }),
        ...(dto.views !== undefined && { views: dto.views }),
        ...(dto.publishedAt !== undefined && { publishedAt: dto.publishedAt }),
        ...(dto.order !== undefined && { order: dto.order }),
      },
    });
  }

  async deleteYouTubeVideo(id: string) {
    return await this.prisma.youTubeVideoV2.delete({ where: { id } });
  }

  // ---------------------------------------------------------------------------
  // SEED INITIAL DIRECTIONS IF EMPTY
  // ---------------------------------------------------------------------------
  async seedInitialDirectionsIfEmpty() {
    const count = await this.prisma.directionV2.count();
    if (count > 0) return;

    const initialItems: CreateDirectionV2Dto[] = [
      {
        title: 'Distributed Event Streaming with Apache Kafka',
        category: 'architecture',
        type: 'current',
        quarter: 'Q1 2026',
        status: 'in_progress',
        description:
          'Building event-driven microservices pipelines with schema registry, dead letter queues, and exactly-once processing guarantees.',
        depth: 'Production Deep Dive',
        tags: ['Kafka', 'Event-Driven', 'Go', 'NestJS'],
        icon: 'Layers',
        link: 'https://github.com/awaluddin-dev',
        linkText: 'Explore Research Repo',
        order: 1,
      },
      {
        title: 'Autonomous Multi-Agent Systems & AGY Orchestration',
        category: 'project',
        type: 'current',
        quarter: 'Q1 2026',
        status: 'in_progress',
        description:
          'Designing autonomous agent loops with dynamic tool retrieval, reactive wakeups, state verification, and long-running job persistence.',
        depth: 'System Implementation',
        tags: ['AI Agents', 'LLM Routing', 'LangGraph', 'TypeScript'],
        icon: 'BrainCircuit',
        link: 'https://github.com/awaluddin-dev',
        linkText: 'View Agent Pipeline',
        order: 2,
      },
      {
        title: 'High-Performance Rust Web Services with Actix-Web & Tokio',
        category: 'learning',
        type: 'current',
        quarter: 'Q1 2026',
        status: 'in_progress',
        description:
          'Deep diving into memory safety, zero-cost abstractions, asynchronous IO, and native gRPC service contracts.',
        depth: 'Core Systems Mastery',
        tags: ['Rust', 'Tokio', 'gRPC', 'Systems'],
        icon: 'Cpu',
        link: 'https://github.com/awaluddin-dev',
        linkText: 'Rust Benchmarks',
        order: 3,
      },
      // Future Roadmap
      {
        title: 'Kubernetes Production Cluster Management & GitOps',
        category: 'architecture',
        type: 'future',
        quarter: 'Q2 2026',
        status: 'planned',
        description:
          'Setting up GitOps deployment workflows via ArgoCD, dynamic autoscaling with KEDA, and strict zero-trust network policies via Cilium.',
        depth: 'Infrastructure & DevOps',
        tags: ['Kubernetes', 'ArgoCD', 'Cilium', 'Helm'],
        icon: 'Cloud',
        order: 1,
      },
      {
        title: 'Real-time Vector Search & Graph RAG Architecture',
        category: 'system',
        type: 'future',
        quarter: 'Q2 2026',
        status: 'planned',
        description:
          'Combining Neo4j knowledge graphs with vector embeddings to achieve explainable and hallucination-resistant RAG systems.',
        depth: 'AI & Knowledge Engineering',
        tags: ['GraphRAG', 'Neo4j', 'Qdrant', 'FastAPI'],
        icon: 'Zap',
        order: 2,
      },
      {
        title: 'High-Frequency FinTech Ledger & Double-Entry Accounting Engine',
        category: 'project',
        type: 'future',
        quarter: 'Q3 2026',
        status: 'planned',
        description:
          'Architecting an immutable financial ledger with ACID transactions, idempotent mutation tokens, and deterministic replay logs.',
        depth: 'Financial Systems',
        tags: ['PostgreSQL', 'Rust', 'FinTech', 'Event Sourcing'],
        icon: 'Server',
        order: 1,
      },
      {
        title: 'Open Source Developer Tooling & CLI Ecosystem',
        category: 'project',
        type: 'future',
        quarter: 'Q4 2026',
        status: 'planned',
        description:
          'Releasing lightweight developer toolkits for rapid NestJS scaffolding, automated database migration verification, and contract testing.',
        depth: 'Open Source',
        tags: ['Open Source', 'CLI', 'TypeScript', 'Developer Tools'],
        icon: 'Terminal',
        order: 1,
      },
    ];

    for (const item of initialItems) {
      await this.create(item);
    }
    this.logger.log('Initial Directions V2 seeded successfully.');
  }
}
