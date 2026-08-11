import { Test, TestingModule } from '@nestjs/testing';
import { SkillsService } from './skills.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, createMockContext } from 'src/prisma/prisma.mock';
import { NotFoundException } from '@nestjs/common';

describe('SkillsService', () => {
  let service: SkillsService;
  let mockCtx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillsService,
        {
          provide: PrismaService,
          useValue: mockCtx.prisma,
        },
      ],
    }).compile();

    service = module.get<SkillsService>(SkillsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CRUD operations for skills and roadmaps', () => {
    const entities = ['skill', 'roadmap'];

    for (const entity of entities) {
      describe(entity, () => {
        it(`should get all`, async () => {
          mockCtx.prisma[entity].findMany = jest
            .fn()
            .mockResolvedValue([{ id: '1' }]);
          const method = `get${entity.charAt(0).toUpperCase() + entity.slice(1)}s`;

          if (typeof service[method as keyof SkillsService] === 'function') {
            const res = await (service as any)[method]();
            const expected = entity === 'skill' ? [{ id: '1', category: '', categoryObj: undefined }] : [{ id: '1' }];
            expect(res).toEqual(expected);
          }
        });

        it(`should get one`, async () => {
          mockCtx.prisma[entity].findUnique = jest
            .fn()
            .mockResolvedValue({ id: '1' });
          const method = `get${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          if (typeof service[method as keyof SkillsService] === 'function') {
            const res = await (service as any)[method]('1');
            const expected = entity === 'skill' ? { id: '1', category: '', categoryObj: undefined } : { id: '1' };
            expect(res).toEqual(expected);
          }
        });

        it(`should create`, async () => {
          mockCtx.prisma[entity].create = jest
            .fn()
            .mockResolvedValue({ id: '1' });
          const method = `create${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          if (typeof service[method as keyof SkillsService] === 'function') {
            const res = await (service as any)[method]({} as any);
            expect(res).toEqual({ id: '1' });
          }
        });

        it(`should update`, async () => {
          mockCtx.prisma[entity].update = jest
            .fn()
            .mockResolvedValue({ id: '1' });
          const method = `update${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          if (typeof service[method as keyof SkillsService] === 'function') {
            const res = await (service as any)[method]('1', {} as any);
            expect(res).toEqual({ id: '1' });
          }
        });

        it(`should delete`, async () => {
          mockCtx.prisma[entity].delete = jest
            .fn()
            .mockResolvedValue({ id: '1' });
          const method = `delete${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          if (typeof service[method as keyof SkillsService] === 'function') {
            const res = await (service as any)[method]('1');
            expect(res).toEqual({ success: true });
          }
        });
      });
    }
  });

  describe('proficiency specific', () => {
    it('should create proficiency with skills', async () => {
      mockCtx.prisma.proficiency.create = jest
        .fn()
        .mockResolvedValue({ id: '1' });
      const res = await service.createProficiency({
        title: 'Test',
        skills: [],
      });
      expect(res).toEqual({ id: '1' });
      expect(mockCtx.prisma.proficiency.create).toHaveBeenCalled();
    });

    it('should update proficiency with skills', async () => {
      mockCtx.prisma.$transaction = jest.fn().mockImplementation(async (cb) => {
        mockCtx.prisma.proficiencySkill.deleteMany = jest.fn();
        mockCtx.prisma.proficiency.update = jest
          .fn()
          .mockResolvedValue({ id: '1' });
        return cb(mockCtx.prisma);
      });
      const res = await service.updateProficiency('1', {
        title: 'Test',
        skills: [],
      });
      expect(res).toEqual({ id: '1' });
    });

    it('should throw when deleting missing proficiency', async () => {
      mockCtx.prisma.proficiency.delete = jest
        .fn()
        .mockRejectedValue(new Error());
      await expect(service.deleteProficiency('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
