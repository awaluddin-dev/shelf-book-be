import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { UnauthorizedException } from '@nestjs/common';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let redisClient: any;

  beforeEach(async () => {
    const mockJwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'secret';
        if (key === 'JWT_REFRESH_SECRET') return 'refresh_secret';
        return null;
      }),
    };

    const mockRedisClient = {
      set: jest.fn(),
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: REDIS_CLIENT,
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    redisClient = module.get(REDIS_CLIENT);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateAndSaveTokens', () => {
    it('should generate and save tokens to redis', async () => {
      const userId = 'user1';
      const email = 'test@example.com';
      
      jest.spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.generateAndSaveTokens(userId, email);

      expect(jwtService.signAsync).toHaveBeenNthCalledWith(1, { sub: userId, email }, { secret: 'secret', expiresIn: '15m' });
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(2, { sub: userId, email }, { secret: 'refresh_secret', expiresIn: '7d' });
      expect(redisClient.set).toHaveBeenCalledWith(`user:${userId}:refresh_token`, 'refresh-token', 'EX', 7 * 24 * 60 * 60);
      expect(result).toEqual({ access_token: 'access-token', refresh_token: 'refresh-token' });
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify token and return payload', async () => {
      const refreshToken = 'valid-refresh-token';
      const payload = { sub: 'user1', email: 'test@example.com' };
      
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);
      redisClient.get.mockResolvedValue(refreshToken);

      const result = await service.verifyRefreshToken(refreshToken);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith(refreshToken, { secret: 'refresh_secret' });
      expect(redisClient.get).toHaveBeenCalledWith(`user:${payload.sub}:refresh_token`);
      expect(result).toEqual(payload);
    });

    it('should throw UnauthorizedException if token not found in redis', async () => {
      const refreshToken = 'valid-refresh-token';
      const payload = { sub: 'user1', email: 'test@example.com' };
      
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);
      redisClient.get.mockResolvedValue(null);

      await expect(service.verifyRefreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
      await expect(service.verifyRefreshToken(refreshToken)).rejects.toThrow('Sesi tidak valid atau telah dicabut (Revoked)');
    });

    it('should throw UnauthorizedException if redis token does not match', async () => {
      const refreshToken = 'valid-refresh-token';
      const payload = { sub: 'user1', email: 'test@example.com' };
      
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);
      redisClient.get.mockResolvedValue('different-refresh-token');

      await expect(service.verifyRefreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
      await expect(service.verifyRefreshToken(refreshToken)).rejects.toThrow('Sesi tidak valid atau telah dicabut (Revoked)');
    });

    it('should throw UnauthorizedException if jwt verify fails', async () => {
      const refreshToken = 'invalid-refresh-token';
      
      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('JWT Error'));

      await expect(service.verifyRefreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
      await expect(service.verifyRefreshToken(refreshToken)).rejects.toThrow('Refresh token kadaluarsa atau tidak valid');
    });
    
    it('should bubble up UnauthorizedException if jwt verify fails with UnauthorizedException', async () => {
      const refreshToken = 'invalid-refresh-token';
      
      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new UnauthorizedException('Specific error'));

      await expect(service.verifyRefreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
      await expect(service.verifyRefreshToken(refreshToken)).rejects.toThrow('Specific error');
    });
  });
});
