/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { HeroService } from './hero.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, createMockContext } from 'src/prisma/prisma.mock';

describe('HeroService', () => {
  let service: HeroService;
  let mockCtx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HeroService,
        {
          provide: PrismaService,
          useValue: mockCtx.prisma,
        },
      ],
    }).compile();

    service = module.get<HeroService>(HeroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Status and Hero', () => {
    it('should return status', async () => {
      mockCtx.prisma.portfolioStatus.findUnique.mockResolvedValue({
        id: 'status_1',
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const result = await service.getStatus();
      expect(result).toBe('available');
    });

    it('should return default busy status if not found', async () => {
      mockCtx.prisma.portfolioStatus.findUnique.mockResolvedValue(null);
      const result = await service.getStatus();
      expect(result).toBe('busy');
    });

    it('should update status', async () => {
      mockCtx.prisma.portfolioStatus.upsert.mockResolvedValue({
        id: 'status_1',
        status: 'away',
        updatedAt: new Date(),
      } as any);
      const result = await service.updateStatus('away');
      expect(result).toEqual({ success: true, status: 'away' });
    });

    it('should get hero data', async () => {
      const mockHero = {
        id: 'hero_1',
        name: 'Test',
        role: 'Engineer',
        createdAt: new Date(),
        updatedAt: new Date(),
        openForWork: true,
        availableFrom: null,
        expertise: null,
        grit: null,
        service: null,
        config: {},
      };
      mockCtx.prisma.heroConfig.findUnique.mockResolvedValue(mockHero);
      mockCtx.prisma.metric.findMany.mockResolvedValue([]);

      const result = await service.getHero();
      expect(result.heroConfig).toEqual(mockHero);
      expect(result.metrics).toEqual([]);
    });

    it('should update hero data successfully', async () => {
      mockCtx.prisma.heroConfig.upsert.mockResolvedValue({} as any);
      mockCtx.prisma.metric.deleteMany.mockResolvedValue({ count: 1 });
      mockCtx.prisma.metric.createMany.mockResolvedValue({ count: 1 });

      const result = await service.updateHero({ name: 'New Name' }, [
        { label: 'Stars', value: '100' },
      ] as any);
      expect(result).toEqual({ success: true });
      expect(mockCtx.prisma.heroConfig.upsert).toHaveBeenCalled();
      expect(mockCtx.prisma.metric.deleteMany).toHaveBeenCalled();
      expect(mockCtx.prisma.metric.createMany).toHaveBeenCalled();
    });
  });
});
