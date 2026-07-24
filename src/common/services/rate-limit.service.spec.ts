import { Test, TestingModule } from '@nestjs/testing';
import { RateLimitService } from './rate-limit.service';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn().mockReturnValue('test-uuid'),
}));

describe('RateLimitService', () => {
  let service: RateLimitService;
  let redisMock: any;

  beforeEach(async () => {
    redisMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimitService,
        {
          provide: REDIS_CLIENT,
          useValue: redisMock,
        },
      ],
    }).compile();

    service = module.get<RateLimitService>(RateLimitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkLimit', () => {
    it('should throw an error if IP is blocked', async () => {
      redisMock.get.mockImplementation(async (key: string) => {
        if (key === 'rate_limit:ip:127.0.0.1') return 'true';
        return null;
      });

      const req = {
        headers: {},
        ip: '127.0.0.1',
        socket: {},
      } as unknown as Request;

      await expect(service.checkLimit(req)).rejects.toThrow(
        new HttpException(
          'Anda telah mengirimkan data hari ini. Silakan coba lagi besok.',
          HttpStatus.TOO_MANY_REQUESTS,
        ),
      );
    });

    it('should throw an error if ETag is blocked', async () => {
      redisMock.get.mockImplementation(async (key: string) => {
        if (key === 'rate_limit:etag:test-etag') return 'true';
        return null;
      });

      const req = {
        headers: { 'x-submit-etag': 'test-etag' },
        ip: '127.0.0.1',
        socket: {},
      } as unknown as Request;

      await expect(service.checkLimit(req)).rejects.toThrow(
        new HttpException(
          'Anda telah mengirimkan data hari ini. Silakan coba lagi besok.',
          HttpStatus.TOO_MANY_REQUESTS,
        ),
      );
    });

    it('should not throw if limit is not exceeded', async () => {
      redisMock.get.mockResolvedValue(null);

      const req = {
        headers: { 'x-forwarded-for': '127.0.0.1' },
        socket: {},
      } as unknown as Request;

      await expect(service.checkLimit(req)).resolves.toBeUndefined();

      const req2 = {
        headers: {},
        socket: { remoteAddress: '127.0.0.1' },
      } as unknown as Request;

      await expect(service.checkLimit(req2)).resolves.toBeUndefined();

      const req3 = {
        headers: {},
        socket: {},
      } as unknown as Request;
      await expect(service.checkLimit(req3)).resolves.toBeUndefined();
    });
  });

  describe('setLimit', () => {
    it('should set limit and ETag headers', async () => {
      const req = {
        headers: { 'x-forwarded-for': '127.0.0.1' },
        socket: {},
      } as unknown as Request;

      const res = {
        header: jest.fn(),
      } as unknown as Response;

      await service.setLimit(req, res);

      expect(redisMock.set).toHaveBeenCalledWith(
        'rate_limit:ip:127.0.0.1',
        'true',
        'EX',
        86400,
      );
      expect(redisMock.set).toHaveBeenCalledWith(
        'rate_limit:etag:test-uuid',
        'true',
        'EX',
        86400,
      );
      expect(res.header).toHaveBeenCalledWith('X-Submit-ETag', 'test-uuid');
      expect(res.header).toHaveBeenCalledWith(
        'Access-Control-Expose-Headers',
        'X-Submit-ETag',
      );
    });

    it('should set limit and ETag headers using req.ip', async () => {
      const req = {
        headers: {},
        ip: '127.0.0.1',
        socket: {},
      } as unknown as Request;

      const res = {
        header: jest.fn(),
      } as unknown as Response;

      await service.setLimit(req, res);

      expect(redisMock.set).toHaveBeenCalledWith(
        'rate_limit:ip:127.0.0.1',
        'true',
        'EX',
        86400,
      );
    });

    it('should set limit and ETag headers using req.socket.remoteAddress', async () => {
      const req = {
        headers: {},
        socket: { remoteAddress: '127.0.0.1' },
      } as unknown as Request;

      const res = {
        header: jest.fn(),
      } as unknown as Response;

      await service.setLimit(req, res);

      expect(redisMock.set).toHaveBeenCalledWith(
        'rate_limit:ip:127.0.0.1',
        'true',
        'EX',
        86400,
      );
    });

    it('should set limit and ETag headers using unknown', async () => {
      const req = {
        headers: {},
        socket: {},
      } as unknown as Request;

      const res = {
        header: jest.fn(),
      } as unknown as Response;

      await service.setLimit(req, res);

      expect(redisMock.set).toHaveBeenCalledWith(
        'rate_limit:ip:unknown',
        'true',
        'EX',
        86400,
      );
    });
  });
});
