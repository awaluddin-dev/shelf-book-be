import { Test, TestingModule } from '@nestjs/testing';
import { CoverLetterService } from './cover-letter.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LlmProviderService } from '../providers/llm-provider.service';

describe('CoverLetterService', () => {
  let service: CoverLetterService;
  let prisma: PrismaService;
  let llm: LlmProviderService;

  const mockPrismaService = {
    heroConfig: {
      findFirst: jest.fn(),
    },
    workExperience: {
      findMany: jest.fn(),
    },
    skill: {
      findMany: jest.fn(),
    },
    project: {
      findMany: jest.fn(),
    },
  };

  const mockLlmProviderService = {
    streamCompletion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoverLetterService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: LlmProviderService,
          useValue: mockLlmProviderService,
        },
      ],
    }).compile();

    service = module.get<CoverLetterService>(CoverLetterService);
    prisma = module.get<PrismaService>(PrismaService);
    llm = module.get<LlmProviderService>(LlmProviderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('streamCoverLetter', () => {
    it('should generate cover letter with full data', async () => {
      mockPrismaService.heroConfig.findFirst.mockResolvedValue({ name: 'John', role: 'Dev', expertise: 'JS' });
      mockPrismaService.workExperience.findMany.mockResolvedValue([
        { role: 'Dev', company: 'ABC', years: '2020-2022', duration: '2 yrs', stack: 'Node', fullImpact: 'Did stuff' }
      ]);
      mockPrismaService.skill.findMany.mockResolvedValue([
        { title: 'Node.js', categoryId: 'backend', level: 'expert' }
      ]);
      mockPrismaService.project.findMany.mockResolvedValue([
        { title: 'Project 1', subtitle: 'P1', tags: [], reasonToBuild: 'fun', problemSolved: 'nothing' }
      ]);
      
      const mockResponse = {} as Response;
      mockLlmProviderService.streamCompletion.mockResolvedValue(mockResponse);

      const result = await service.streamCoverLetter({ jobDescription: 'Needs Node' });

      expect(prisma.heroConfig.findFirst).toHaveBeenCalled();
      expect(prisma.workExperience.findMany).toHaveBeenCalled();
      expect(prisma.skill.findMany).toHaveBeenCalled();
      expect(prisma.project.findMany).toHaveBeenCalled();

      expect(llm.streamCompletion).toHaveBeenCalled();
      expect(llm.streamCompletion.mock.calls[0][0][0].content).toContain('Needs Node');
      expect(llm.streamCompletion.mock.calls[0][0][0].content).toContain('John');
      expect(llm.streamCompletion.mock.calls[0][0][0].content).toContain('ABC');
      expect(llm.streamCompletion.mock.calls[0][0][0].content).toContain('Project 1');
      expect(result).toBe(mockResponse);
    });

    it('should generate cover letter with missing hero data fallback', async () => {
      mockPrismaService.heroConfig.findFirst.mockResolvedValue(null);
      mockPrismaService.workExperience.findMany.mockResolvedValue([]);
      mockPrismaService.skill.findMany.mockResolvedValue([]);
      mockPrismaService.project.findMany.mockResolvedValue([
        { title: 'Project 2', subtitle: 'P2' } // missing problemSolved
      ]);
      
      const mockResponse = {} as Response;
      mockLlmProviderService.streamCompletion.mockResolvedValue(mockResponse);

      const result = await service.streamCoverLetter({ jobDescription: 'Needs Node' });

      expect(llm.streamCompletion).toHaveBeenCalled();
      expect(llm.streamCompletion.mock.calls[0][0][0].content).toContain('Name: Awaluddin');
      expect(llm.streamCompletion.mock.calls[0][0][0].content).toContain('Project 2');
      expect(result).toBe(mockResponse);
    });
    
    it('should generate cover letter with partial hero data', async () => {
      mockPrismaService.heroConfig.findFirst.mockResolvedValue({});
      mockPrismaService.workExperience.findMany.mockResolvedValue([]);
      mockPrismaService.skill.findMany.mockResolvedValue([]);
      mockPrismaService.project.findMany.mockResolvedValue([]);
      
      const mockResponse = {} as Response;
      mockLlmProviderService.streamCompletion.mockResolvedValue(mockResponse);

      const result = await service.streamCoverLetter({ jobDescription: 'Needs Node' });

      expect(llm.streamCompletion).toHaveBeenCalled();
      expect(llm.streamCompletion.mock.calls[0][0][0].content).toContain('Name: Awaluddin');
      expect(result).toBe(mockResponse);
    });
  });

  describe('streamDraftInquiry', () => {
    it('should generate draft inquiry', async () => {
      const mockResponse = {} as Response;
      mockLlmProviderService.streamCompletion.mockResolvedValue(mockResponse);

      const result = await service.streamDraftInquiry({ coverLetter: 'My CL' });

      expect(llm.streamCompletion).toHaveBeenCalled();
      expect(llm.streamCompletion.mock.calls[0][0][0].content).toContain('My CL');
      expect(result).toBe(mockResponse);
    });
  });
});
