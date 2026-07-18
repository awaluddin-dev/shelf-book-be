import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioService, GenericModelDelegate } from './portfolio.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { prismaMockProvider, Context, createMockContext } from 'src/prisma/prisma.mock';
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
        }
      ],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Generic Array Methods', () => {
    const mockModel: GenericModelDelegate = {
      findMany: jest.fn().mockResolvedValue([{ id: '1', name: 'Item 1' }]),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    it('should return array data', async () => {
      const result = await service.getArrayData(mockModel);
      expect(result).toEqual([{ id: '1', name: 'Item 1' }]);
      expect(mockModel.findMany).toHaveBeenCalled();
    });

    it('should get array item by id', async () => {
      (mockModel.findUnique as jest.Mock).mockResolvedValue({ id: '1', name: 'Item 1' });
      const result = await service.getArrayItem(mockModel, '1');
      expect(result).toEqual({ id: '1', name: 'Item 1' });
      expect(mockModel.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if item not found', async () => {
      (mockModel.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.getArrayItem(mockModel, '999')).rejects.toThrow(NotFoundException);
    });

    it('should create array item', async () => {
      const payload = { name: 'New Item' };
      (mockModel.create as jest.Mock).mockResolvedValue({ id: '2', ...payload });
      const result = await service.createArrayItem(mockModel, payload);
      expect(result).toEqual({ id: '2', name: 'New Item' });
      expect(mockModel.create).toHaveBeenCalledWith({ data: payload });
    });

    it('should update array item', async () => {
      const payload = { name: 'Updated Item' };
      (mockModel.update as jest.Mock).mockResolvedValue({ id: '1', ...payload });
      const result = await service.updateArrayItem(mockModel, '1', payload);
      expect(result).toEqual({ id: '1', name: 'Updated Item' });
    });
    
    it('should handle update error by throwing NotFoundException', async () => {
      (mockModel.update as jest.Mock).mockRejectedValue(new Error('Record not found'));
      await expect(service.updateArrayItem(mockModel, '1', {})).rejects.toThrow(NotFoundException);
    });

    it('should delete array item', async () => {
      (mockModel.delete as jest.Mock).mockResolvedValue({ id: '1' });
      const result = await service.deleteArrayItem(mockModel, '1');
      expect(result).toEqual({ success: true });
    });
    
    it('should handle delete error by throwing NotFoundException', async () => {
      (mockModel.delete as jest.Mock).mockRejectedValue(new Error('Record not found'));
      await expect(service.deleteArrayItem(mockModel, '1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('Specific Methods', () => {
    it('should return status', async () => {
      mockCtx.prisma.portfolioStatus.findUnique.mockResolvedValue({ id: 'status_1', status: 'available', updatedAt: new Date() });
      const result = await service.getStatus();
      expect(result).toBe('available');
    });

    it('should return default busy status if not found', async () => {
      mockCtx.prisma.portfolioStatus.findUnique.mockResolvedValue(null);
      const result = await service.getStatus();
      expect(result).toBe('busy');
    });

    it('should update status', async () => {
      mockCtx.prisma.portfolioStatus.upsert.mockResolvedValue({ id: 'status_1', status: 'away', updatedAt: new Date() });
      const result = await service.updateStatus('away');
      expect(result).toEqual({ success: true, status: 'away' });
    });

    it('should get hero data', async () => {
      const mockHero = { id: 'hero_1', title: 'Hello', description: 'Desc', name: 'Test', imageUrl: 'url', updatedAt: new Date(), githubUrl: null, linkedinUrl: null, resumeUrl: null };
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

      const result = await service.updateHero({ title: 'New Title' }, [{ label: 'Stars', value: '100' }]);
      expect(result).toEqual({ success: true });
      expect(mockCtx.prisma.heroConfig.upsert).toHaveBeenCalled();
      expect(mockCtx.prisma.metric.deleteMany).toHaveBeenCalled();
      expect(mockCtx.prisma.metric.createMany).toHaveBeenCalled();
    });
  });
});
