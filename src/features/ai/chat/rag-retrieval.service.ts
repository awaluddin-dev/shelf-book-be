import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface RetrievedContext {
  source: string;
  content: string;
}

@Injectable()
export class RagRetrievalService {
  private readonly logger = new Logger(RagRetrievalService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Indonesian → English keyword translation map.
   * Covers the most common portfolio-related queries in Bahasa Indonesia.
   * Keywords not in this map are passed through as-is (for proper nouns,
   * tech names, and English words that appear in the DB content).
   */
  private readonly ID_TO_EN: Record<string, string> = {
    // Experience / work
    pengalaman: 'experience',
    kerja: 'work',
    pekerjaan: 'work',
    karir: 'career',
    riwayat: 'history',
    perusahaan: 'company',
    posisi: 'role',
    jabatan: 'role',
    // Skills / tech
    keahlian: 'skill',
    kemampuan: 'skill',
    teknologi: 'technology',
    bahasa: 'language',
    pemrograman: 'programming',
    // Projects
    proyek: 'project',
    projek: 'project',
    aplikasi: 'application',
    sistem: 'system',
    bangun: 'build',
    buat: 'build',
    // Availability
    tersedia: 'available',
    ketersediaan: 'availability',
    rekrut: 'hire',
    rekrutmen: 'hire',
    lowongan: 'job',
    lamaran: 'application',
    // Education / background
    pendidikan: 'education',
    latar: 'background',
    belakang: 'background',
    lulusan: 'graduate',
    universitas: 'university',
    // General
    tentang: 'about',
    siapa: 'who',
    cerita: 'story',
    fokus: 'focus',
    sekarang: 'current',
    saat: 'current',
    ini: 'current',
  };

  /**
   * Extract and normalize keywords from the user's question.
   * Handles both English and Bahasa Indonesia input.
   * Indonesian domain words are translated to English before DB search
   * since all DB content is stored in English.
   */
  private extractKeywords(question: string): string[] {
    const stopWords = new Set([
      // English stop words
      'a',
      'an',
      'the',
      'is',
      'are',
      'was',
      'were',
      'be',
      'been',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'could',
      'should',
      'may',
      'might',
      'can',
      'to',
      'of',
      'in',
      'on',
      'at',
      'for',
      'with',
      'about',
      'your',
      'you',
      'his',
      'her',
      'their',
      'what',
      'how',
      'when',
      'where',
      'who',
      'why',
      'tell',
      'me',
      'i',
      'and',
      'or',
      'but',
      'any',
      'some',
      'than',
      'that',
      'this',
      'which',
      'from',
      'by',
      'as',
      'it',
      'he',
      'she',
      // Indonesian stop words
      'apa',
      'siapa',
      'dimana',
      'kapan',
      'kenapa',
      'mengapa',
      'bagaimana',
      'yang',
      'dan',
      'atau',
      'tapi',
      'tetapi',
      'namun',
      'dengan',
      'untuk',
      'dari',
      'pada',
      'ini',
      'itu',
      'ada',
      'tidak',
      'bisa',
      'bukan',
      'adalah',
      'merupakan',
      'juga',
      'sudah',
      'pernah',
      'sedang',
      'akan',
      'saya',
      'anda',
      'dia',
      'mereka',
      'kita',
      'kami',
      'kamu',
      'nya',
      'apakah',
      'apakan',
      'tolong',
      'ceritakan',
      'jelaskan',
      'beritahu',
      'boleh',
      'mau',
      'ingin',
      'minta',
      'coba',
      'dong',
      'deh',
      'sih',
      'lebih',
      'sangat',
      'sekali',
      'juga',
      'sudah',
      'belum',
      'lagi',
    ]);

    const tokens = question
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));

    // Translate Indonesian domain words → English, pass others through
    const translated = tokens.map((w) => this.ID_TO_EN[w] ?? w);

    return [...new Set(translated)].slice(0, 8);
  }

  /**
   * Run parallel full-text search across all portfolio tables.
   * Uses PostgreSQL ILIKE for broad matching without extension setup.
   */
  async retrieve(question: string): Promise<RetrievedContext[]> {
    const keywords = this.extractKeywords(question);

    if (keywords.length === 0) {
      this.logger.warn('No keywords extracted from question');
      return [];
    }

    this.logger.log(`RAG keywords: [${keywords.join(', ')}]`);

    // Build ILIKE conditions for each keyword — OR within field, AND across nothing
    // We want broad recall: match if ANY keyword appears in ANY relevant field
    const ilikeConditions = (fields: string[]) =>
      keywords.flatMap((kw) =>
        fields.map((field) => ({
          [field]: { contains: kw, mode: 'insensitive' as const },
        })),
      );

    const [hero, experiences, skills, projects, testimonials, currentFocus] =
      await Promise.all([
        // HeroConfig — always include, it's the identity anchor
        this.prisma.heroConfig.findFirst(),

        // WorkExperience — match on role, company, stack, fullImpact
        this.prisma.workExperience.findMany({
          where: {
            OR: ilikeConditions([
              'role',
              'company',
              'stack',
              'fullImpact',
              'teaser',
            ]),
          },
          take: 3,
        }),

        // Skills — match on title, category (via relation), details
        this.prisma.skill.findMany({
          where: {
            OR: [
              ...ilikeConditions(['title', 'details']),
              ...keywords.map((kw) => ({
                category: {
                  title: { contains: kw, mode: 'insensitive' as const },
                },
              })),
            ],
          },
          take: 8,
        }),

        // Projects — match on title, subtitle, markdown, problemSolved
        this.prisma.project.findMany({
          where: {
            OR: ilikeConditions([
              'title',
              'subtitle',
              'markdown',
              'problemSolved',
              'reasonToBuild',
            ]),
          },
          select: {
            title: true,
            subtitle: true,
            tags: true,
            problemSolved: true,
            reasonToBuild: true,
            date: true,
          },
          take: 3,
        }),

        // Testimonials — approved only
        this.prisma.testimonial.findMany({
          where: {
            status: 'approved',
            OR: ilikeConditions(['testimonial', 'name', 'company']),
          },
          take: 2,
        }),

        // CurrentFocus — always include for availability/current work questions
        this.prisma.currentFocus.findMany({ take: 3 }),
      ]);

    const context: RetrievedContext[] = [];

    // Hero — always inject as identity baseline
    if (hero) {
      context.push({
        source: 'profile',
        content: `Name: ${hero.name}
Role: ${hero.role}
Open for work: ${hero.openForWork ? 'Yes' : 'No'}
Available from: ${hero.availableFrom ?? 'Immediately'}
Expertise: ${hero.expertise ?? ''}
Service offerings: ${hero.service ?? ''}`,
      });
    }

    if (experiences.length > 0) {
      context.push({
        source: 'work_experience',
        content: experiences
          .map(
            (e) =>
              `${e.role} at ${e.company} (${e.years}, ${e.duration})
Stack: ${e.stack}
Impact: ${e.fullImpact}`,
          )
          .join('\n\n'),
      });
    }

    if (skills.length > 0) {
      context.push({
        source: 'skills',
        content: skills
          .map(
            (s) =>
              `${s.title} — ${s.categoryId}, level: ${s.level}. ${s.details}`,
          )
          .join('\n'),
      });
    }

    if (projects.length > 0) {
      context.push({
        source: 'projects',
        content: projects
          .map(
            (p) =>
              `${p.title} (${p.date}): ${p.subtitle}
Tags: ${p.tags.join(', ')}${p.problemSolved ? `\nProblem solved: ${p.problemSolved}` : ''}`,
          )
          .join('\n\n'),
      });
    }

    if (testimonials.length > 0) {
      context.push({
        source: 'testimonials',
        content: testimonials
          .map(
            (t) => `"${t.testimonial}" — ${t.name}, ${t.role} at ${t.company}`,
          )
          .join('\n'),
      });
    }

    if (currentFocus.length > 0) {
      context.push({
        source: 'current_focus',
        content: currentFocus
          .map((f) => `${f.title}: ${f.description}`)
          .join('\n'),
      });
    }

    this.logger.log(`RAG retrieved ${context.length} context blocks`);
    return context;
  }
}
