import { Injectable, Logger } from '@nestjs/common'; // adjust path if different
import { LlmProviderService } from '../providers/llm-provider.service';
import { GenerateCoverLetterDto } from './dto/generate-cover-letter.dto';
import { DraftInquiryDto } from './dto/draft-inquiry.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class CoverLetterService {
  private readonly logger = new Logger(CoverLetterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly llm: LlmProviderService,
  ) {}

  async streamCoverLetter(dto: GenerateCoverLetterDto): Promise<Response> {
    // Fetch all context in parallel — single round-trip to DB
    const [hero, experiences, skills, projects] = await Promise.all([
      this.prisma.heroConfig.findFirst(),
      this.prisma.workExperience.findMany({
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.skill.findMany({
        where: { level: { in: ['expert', 'advanced', 'proficient'] } },
        orderBy: { level: 'asc' },
      }),
      this.prisma.project.findMany({
        select: {
          title: true,
          subtitle: true,
          tags: true,
          reasonToBuild: true,
          problemSolved: true,
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Build context block from DB data
    const heroBlock = hero
      ? `Name: ${hero.name ?? 'Awaluddin'}
Current Role: ${hero.role ?? 'Backend Engineer & AI Integrator'}
Expertise: ${hero.expertise ?? ''}`
      : 'Name: Awaluddin\nRole: Backend Engineer & AI Integrator';

    const experienceBlock = experiences
      .map(
        (e) =>
          `- ${e.role} at ${e.company} (${e.years}, ${e.duration})
  Stack: ${e.stack}
  Impact: ${e.fullImpact}`,
      )
      .join('\n');

    const skillsBlock = skills
      .map((s) => `${s.title} (${s.categoryId}, ${s.level})`)
      .join(', ');

    const projectsBlock = projects
      .map(
        (p) =>
          `- ${p.title}: ${p.subtitle}${p.problemSolved ? ` - solved: ${p.problemSolved}` : ''}`,
      )
      .join('\n');

    const prompt = `You are writing a professional cover letter on behalf of a software engineer applying for a job.

      ABOUT THE ENGINEER:
      ${heroBlock}

      WORK EXPERIENCE:
      ${experienceBlock}

      KEY SKILLS:
      ${skillsBlock}

      NOTABLE PROJECTS:
      ${projectsBlock}

      JOB DESCRIPTION THE ENGINEER IS APPLYING FOR:
      ${dto.jobDescription}

      INSTRUCTIONS:
      Write a cover letter that:
      1. Opens with a specific hook tied to the job description — not a generic "I am writing to apply" opener.
      2. Connects 2-3 specific experiences or projects from the engineer's background to the job requirements.
      3. Demonstrates understanding of the company's technical challenges based on the JD.
      4. Closes with a clear, confident call to action.
      5. Total length: 3-4 paragraphs, strictly under 350 words.
      6. NO Markdown formatting — plain prose only.
      7. NO placeholders like [Company Name] — infer the company name from the JD if possible, or write around it naturally.
      8. Tone: confident and direct, not sycophantic. Avoid "I am passionate about" or "I am excited to".
      9. Write in first person as the engineer.
      10. CRITICAL: DO NOT hallucinate facts, locations, or experiences. You are strictly based in Indonesia. If the JD requires a different location (e.g., Australia), state that you are based in Indonesia but fully capable and ready to work remotely across time zones.`;

    this.logger.log('Streaming cover letter generation');
    return this.llm.streamCompletion([{ role: 'user', content: prompt }]);
  }

  async streamDraftInquiry(dto: DraftInquiryDto): Promise<Response> {
    const prompt = `You are a recruiter or hiring manager who has just read the following cover letter from a candidate named Awaluddin.
    
    COVER LETTER:
    ${dto.coverLetter}
    
    INSTRUCTIONS:
    Write a short, professional email (under 100 words) addressed to Awaluddin.
    Express interest in his profile based on what was written in the cover letter.
    Ask for a brief introductory call to discuss opportunities further.
    Leave generic placeholders for your name and company (e.g. [Your Name], [Company Name]).
    DO NOT include a subject line, just the body of the email starting with "Hi Awaluddin".
    DO NOT use Markdown formatting. Plain text only.
    Make it sound human, polite, and eager.`;

    this.logger.log('Streaming draft inquiry generation');
    return this.llm.streamCompletion([{ role: 'user', content: prompt }]);
  }
}
