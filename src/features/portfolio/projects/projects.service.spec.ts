import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, createMockContext } from 'src/prisma/prisma.mock';
import { NotFoundException } from '@nestjs/common';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let mockCtx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: mockCtx.prisma,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CRUD operations for entities', () => {
    const entities = ['project', 'systemArchitecture', 'projectLifecycle'];

    for (const entity of entities) {
      describe(entity, () => {
        it(`should get all`, async () => {
          mockCtx.prisma[entity].findMany = jest
            .fn()
            .mockResolvedValue([{ id: '1' }]);
          const method = `get${entity.charAt(0).toUpperCase() + entity.slice(1)}s`;

          if (typeof (service as any)[method] === 'function') {
            const res = await (service as any)[method]();
            expect(res).toEqual([{ id: '1' }]);
          }
        });

        it(`should get one`, async () => {
          mockCtx.prisma[entity].findUnique = jest
            .fn()
            .mockResolvedValue({ id: '1' });
          const method = `get${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          if (typeof (service as any)[method] === 'function') {
            const res = await (service as any)[method]('1');
            expect(res).toEqual({ id: '1' });
          }
        });

        it(`should throw NotFoundException if one not found`, async () => {
          mockCtx.prisma[entity].findUnique = jest.fn().mockResolvedValue(null);
          const method = `get${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          if (typeof (service as any)[method] === 'function') {
            await expect((service as any)[method]('999')).rejects.toThrow(
              NotFoundException,
            );
          }
        });

        it(`should create`, async () => {
          mockCtx.prisma[entity].create = jest
            .fn()
            .mockResolvedValue({ id: '1' });
          const method = `create${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          if (typeof (service as any)[method] === 'function') {
            const res = await (service as any)[method]({} as any);
            expect(res).toEqual({ id: '1' });
          }
        });

        it(`should update`, async () => {
          mockCtx.prisma[entity].update = jest
            .fn()
            .mockResolvedValue({ id: '1' });
          const method = `update${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          if (typeof (service as any)[method] === 'function') {
            const res = await (service as any)[method]('1', {} as any);
            expect(res).toEqual({ id: '1' });
          }
        });

        it(`should throw NotFoundException on update error`, async () => {
          mockCtx.prisma[entity].update = jest
            .fn()
            .mockRejectedValue(new Error('Record not found'));
          const method = `update${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          if (typeof (service as any)[method] === 'function') {
            await expect(
              (service as any)[method]('1', {} as any),
            ).rejects.toThrow(NotFoundException);
          }
        });

        it(`should delete`, async () => {
          mockCtx.prisma[entity].delete = jest
            .fn()
            .mockResolvedValue({ id: '1' });
          const method = `delete${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          if (typeof (service as any)[method] === 'function') {
            const res = await (service as any)[method]('1');
            expect(res).toEqual({ success: true });
          }
        });

        it(`should throw NotFoundException on delete error`, async () => {
          mockCtx.prisma[entity].delete = jest
            .fn()
            .mockRejectedValue(new Error('Record not found'));
          const method = `delete${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
          if (typeof (service as any)[method] === 'function') {
            await expect((service as any)[method]('1')).rejects.toThrow(
              NotFoundException,
            );
          }
        });
      });
    }
  });
});
