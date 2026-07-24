import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceService } from './experience.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, createMockContext } from 'src/prisma/prisma.mock';
import { NotFoundException } from '@nestjs/common';

describe('ExperienceService', () => {
  let service: ExperienceService;
  let mockCtx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperienceService,
        {
          provide: PrismaService,
          useValue: mockCtx.prisma,
        },
      ],
    }).compile();

    service = module.get<ExperienceService>(ExperienceService);
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
      await expect(service.getTestimonial('999')).rejects.toThrow(NotFoundException);
    });

    it('should create testimonial', async () => {
      const payload: any = { name: 'New Testimonial' };
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
      const payload: any = { name: 'Updated' };
      mockCtx.prisma.testimonial.update.mockResolvedValue({
        id: '1',
        ...payload,
      } as any);
      const result = await service.updateTestimonial('1', payload);
      expect(result).toEqual({ id: '1', name: 'Updated' });
    });

    it('should handle update error by throwing NotFoundException', async () => {
      mockCtx.prisma.testimonial.update.mockRejectedValue(new Error('Record not found'));
      await expect(service.updateTestimonial('1', {})).rejects.toThrow(NotFoundException);
    });

    it('should delete testimonial', async () => {
      mockCtx.prisma.testimonial.delete.mockResolvedValue({ id: '1' } as any);
      const result = await service.deleteTestimonial('1');
      expect(result).toEqual({ success: true });
    });

    it('should handle delete error by throwing NotFoundException', async () => {
      mockCtx.prisma.testimonial.delete.mockRejectedValue(new Error('Record not found'));
      await expect(service.deleteTestimonial('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('Other CRUD entities', () => {
    const entities = ['workExperience', 'currentFocus'];

    for (const entity of entities) {
      describe(entity, () => {
        it(`should get all`, async () => {
          mockCtx.prisma[entity].findMany = jest.fn().mockResolvedValue([{ id: '1' }]);
          const method = entity === 'currentFocus' ? 'getCurrentFoci' : `get${entity.charAt(0).toUpperCase() + entity.slice(1)}s`;
          const res = await (service as any)[method]();
          expect(res).toEqual([{ id: '1' }]);
        });

        it(`should get one`, async () => {
          mockCtx.prisma[entity].findUnique = jest.fn().mockResolvedValue({ id: '1' });
          const method = `get${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          const res = await (service as any)[method]('1');
          expect(res).toEqual({ id: '1' });
        });

        it(`should create`, async () => {
          mockCtx.prisma[entity].create = jest.fn().mockResolvedValue({ id: '1' });
          const method = `create${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          const res = await (service as any)[method]({} as any);
          expect(res).toEqual({ id: '1' });
        });

        it(`should update`, async () => {
          mockCtx.prisma[entity].update = jest.fn().mockResolvedValue({ id: '1' });
          const method = `update${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          const res = await (service as any)[method]('1', {} as any);
          expect(res).toEqual({ id: '1' });
        });

        it(`should delete`, async () => {
          mockCtx.prisma[entity].delete = jest.fn().mockResolvedValue({ id: '1' });
          const method = `delete${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          const res = await (service as any)[method]('1');
          expect(res).toEqual({ success: true });
        });
      });
    }
  });
});
