import { Test, TestingModule } from '@nestjs/testing';
import { RagRetrievalService } from './rag-retrieval.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('RagRetrievalService', () => {
  let service: RagRetrievalService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const prismaMock = {
      heroConfig: { findFirst: jest.fn() },
      workExperience: { findMany: jest.fn() },
      skill: { findMany: jest.fn() },
      project: { findMany: jest.fn() },
      testimonial: { findMany: jest.fn() },
      currentFocus: { findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RagRetrievalService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<RagRetrievalService>(RagRetrievalService);
    prisma = module.get(PrismaService);
  });

  describe('retrieve', () => {
    it('should return empty if no keywords', async () => {
      const res = await service.retrieve('a the is'); // only stopwords
      expect(res).toEqual([]);
    });

    it('should translate indonesian keywords and fetch data', async () => {
      prisma.heroConfig.findFirst.mockResolvedValue({
        name: 'Awaluddin',
        role: 'Dev',
        openForWork: true,
        availableFrom: 'Now',
        expertise: 'Tech',
        service: 'Code',
      } as any);

      prisma.workExperience.findMany.mockResolvedValue([
        {
          role: 'Dev',
          company: 'X',
          years: '2',
          duration: '2y',
          stack: 'JS',
          fullImpact: 'Did it',
        },
      ] as any);

      prisma.skill.findMany.mockResolvedValue([
        { title: 'TS', categoryId: 'Language', level: 'Pro', details: 'Good' },
      ] as any);

      prisma.project.findMany.mockResolvedValue([
        {
          title: 'P1',
          subtitle: 'Sub',
          tags: ['T1'],
          problemSolved: 'P',
          date: '2020',
        },
      ] as any);

      prisma.testimonial.findMany.mockResolvedValue([
        { testimonial: 'Great', name: 'Bob', role: 'CTO', company: 'Y' },
      ] as any);

      prisma.currentFocus.findMany.mockResolvedValue([
        { title: 'F1', description: 'Desc' },
      ] as any);

      const res = await service.retrieve('pengalaman kerja tentang teknologi');
      expect(res.length).toBe(6);

      expect(prisma.workExperience.findMany).toHaveBeenCalled();
      const whereClause = (prisma.workExperience.findMany as jest.Mock).mock
        .calls[0][0].where.OR;
      // Should have 'experience', 'work', 'about', 'technology' in the condition
      expect(JSON.stringify(whereClause)).toContain('experience');
      expect(JSON.stringify(whereClause)).toContain('technology');
    });

    it('should handle missing optional fields', async () => {
      prisma.heroConfig.findFirst.mockResolvedValue({
        name: 'A',
        role: 'B',
        openForWork: false,
      } as any);
      prisma.workExperience.findMany.mockResolvedValue([]);
      prisma.skill.findMany.mockResolvedValue([]);
      prisma.project.findMany.mockResolvedValue([
        { title: 'P2', subtitle: 'Sub2', tags: ['T2'], date: '2021' }, // no problemSolved
      ] as any);
      prisma.testimonial.findMany.mockResolvedValue([]);
      prisma.currentFocus.findMany.mockResolvedValue([]);

      const res = await service.retrieve('react project');
      expect(res.length).toBe(2);
      expect(res[0].source).toBe('profile');
      expect(res[1].source).toBe('projects');
      expect(res[1].content).toContain('Tags: T2');
    });

    it('should handle no hero', async () => {
      prisma.heroConfig.findFirst.mockResolvedValue(null);
      prisma.workExperience.findMany.mockResolvedValue([]);
      prisma.skill.findMany.mockResolvedValue([]);
      prisma.project.findMany.mockResolvedValue([]);
      prisma.testimonial.findMany.mockResolvedValue([]);
      prisma.currentFocus.findMany.mockResolvedValue([]);

      const res = await service.retrieve('test keyword');
      expect(res.length).toBe(0);
    });
  });
});
