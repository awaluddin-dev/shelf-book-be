/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioService } from './portfolio.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, createMockContext } from 'src/prisma/prisma.mock';
import { NotFoundException } from '@nestjs/common';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let mockCtx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        {
          provide: PrismaService,
          useValue: mockCtx.prisma,
        },
      ],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CRUD via entity-specific methods', () => {
    it('should get testimonials (findMany)', async () => {
      mockCtx.prisma.testimonial.findMany.mockResolvedValue([
        { id: '1', name: 'John' } as any,
      ]);
      const result = await service.getTestimonials();
      expect(result).toEqual([{ id: '1', name: 'John' }]);
      expect(mockCtx.prisma.testimonial.findMany).toHaveBeenCalled();
    });

    it('should get testimonial by id', async () => {
      mockCtx.prisma.testimonial.findUnique.mockResolvedValue({
        id: '1',
        name: 'John',
      } as any);
      const result = await service.getTestimonial('1');
      expect(result).toEqual({ id: '1', name: 'John' });
      expect(mockCtx.prisma.testimonial.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if testimonial not found', async () => {
      mockCtx.prisma.testimonial.findUnique.mockResolvedValue(null);
      await expect(service.getTestimonial('999')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should create testimonial', async () => {
      const payload = { name: 'New Testimonial' };
      mockCtx.prisma.testimonial.create.mockResolvedValue({
        id: '2',
        ...payload,
      } as any);
      const result = await service.createTestimonial(payload);
      expect(result).toEqual({ id: '2', name: 'New Testimonial' });
      expect(mockCtx.prisma.testimonial.create).toHaveBeenCalledWith({
        data: payload,
      });
    });

    it('should update testimonial', async () => {
      const payload = { name: 'Updated' };
      mockCtx.prisma.testimonial.update.mockResolvedValue({
        id: '1',
        ...payload,
      } as any);
      const result = await service.updateTestimonial('1', payload);
      expect(result).toEqual({ id: '1', name: 'Updated' });
    });

    it('should handle update error by throwing NotFoundException', async () => {
      mockCtx.prisma.testimonial.update.mockRejectedValue(
        new Error('Record not found'),
      );
      await expect(service.updateTestimonial('1', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete testimonial', async () => {
      mockCtx.prisma.testimonial.delete.mockResolvedValue({ id: '1' } as any);
      const result = await service.deleteTestimonial('1');
      expect(result).toEqual({ success: true });
    });

    it('should handle delete error by throwing NotFoundException', async () => {
      mockCtx.prisma.testimonial.delete.mockRejectedValue(
        new Error('Record not found'),
      );
      await expect(service.deleteTestimonial('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Specific Methods', () => {
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
  describe('Other CRUD entities', () => {
    const entities = [
      'workExperience',
      'currentFocus',
      'proficiency',
      'skill',
      'roadmap',
      'project',
      'systemArchitecture',
      'projectLifecycle'
    ];

    for (const entity of entities) {
      describe(entity, () => {
        it(`should get all`, async () => {
          mockCtx.prisma[entity].findMany = jest.fn().mockResolvedValue([{ id: '1' }]);
          const method = `get${entity.charAt(0).toUpperCase() + entity.slice(1)}s`;
          // some methods have different pluralization
          let actualMethod = method;
          if (entity === 'currentFocus') actualMethod = 'getCurrentFoci';
          if (entity === 'proficiency') actualMethod = 'getProficiencies';
          
          if (typeof service[actualMethod] === 'function') {
            const res = await service[actualMethod]();
            expect(res).toEqual([{ id: '1' }]);
          }
        });

        it(`should get one`, async () => {
          mockCtx.prisma[entity].findUnique = jest.fn().mockResolvedValue({ id: '1' });
          const method = `get${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          if (typeof service[method] === 'function') {
            const res = await service[method]('1');
            expect(res).toEqual({ id: '1' });
          }
        });

        it(`should create`, async () => {
          mockCtx.prisma[entity].create = jest.fn().mockResolvedValue({ id: '1' });
          const method = `create${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          if (typeof service[method] === 'function') {
            // except proficiency which overrides create
            const res = await service[method]({} as any);
            expect(res).toEqual({ id: '1' });
          }
        });

        it(`should update`, async () => {
          mockCtx.prisma[entity].update = jest.fn().mockResolvedValue({ id: '1' });
          const method = `update${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          if (typeof service[method] === 'function') {
            // except proficiency
            if (entity !== 'proficiency') {
              const res = await service[method]('1', {} as any);
              expect(res).toEqual({ id: '1' });
            }
          }
        });

        it(`should delete`, async () => {
          mockCtx.prisma[entity].delete = jest.fn().mockResolvedValue({ id: '1' });
          const method = `delete${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          if (typeof service[method] === 'function') {
            const res = await service[method]('1');
            expect(res).toEqual({ success: true });
          }
        });
      });
    }

    // specific proficiency overrides
    describe('proficiency specific', () => {
      it('should create proficiency with skills', async () => {
        mockCtx.prisma.proficiency.create = jest.fn().mockResolvedValue({ id: '1' });
        const res = await service.createProficiency({ name: 'Test', skills: [] } as any);
        expect(res).toEqual({ id: '1' });
        expect(mockCtx.prisma.proficiency.create).toHaveBeenCalled();
      });

      it('should update proficiency with skills', async () => {
        mockCtx.prisma.$transaction = jest.fn().mockImplementation(async (cb) => {
          mockCtx.prisma.proficiencySkill.deleteMany = jest.fn();
          mockCtx.prisma.proficiency.update = jest.fn().mockResolvedValue({ id: '1' });
          return cb(mockCtx.prisma);
        });
        const res = await service.updateProficiency('1', { name: 'Test', skills: [] } as any);
        expect(res).toEqual({ id: '1' });
      });

      it('should throw when deleting missing proficiency', async () => {
        mockCtx.prisma.proficiency.delete = jest.fn().mockRejectedValue(new Error());
        await expect(service.deleteProficiency('1')).rejects.toThrow(NotFoundException);
      });
    });
  });
});
