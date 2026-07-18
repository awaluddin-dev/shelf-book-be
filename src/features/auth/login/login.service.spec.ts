import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from '../shared/token.service';
import { prismaMockProvider, Context, createMockContext } from 'src/prisma/prisma.mock';
import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

jest.mock('argon2');

describe('LoginService', () => {
  let service: LoginService;
  let mockCtx: Context;
  let mockTokenService: Partial<TokenService>;

  beforeEach(async () => {
    mockCtx = createMockContext();
    mockTokenService = {
      generateAndSaveTokens: jest.fn().mockResolvedValue({ accessToken: 'access', refreshToken: 'refresh' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: PrismaService,
          useValue: mockCtx.prisma,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
    
    // Mock global fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw UnauthorizedException if captcha fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: false }),
    });

    await expect(
      service.execute({ email: 'test@example.com', password: 'password', turnstileToken: 'invalid' })
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if email not found', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: true }),
    });
    mockCtx.prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.execute({ email: 'notfound@example.com', password: 'password', turnstileToken: 'valid' })
    ).rejects.toThrow(new UnauthorizedException('Email atau password salah'));
  });

  it('should throw UnauthorizedException if password does not match', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: true }),
    });
    mockCtx.prisma.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: 'hashedpassword',
    } as any);
    
    (argon2.verify as jest.Mock).mockResolvedValue(false);

    await expect(
      service.execute({ email: 'test@example.com', password: 'wrongpassword', turnstileToken: 'valid' })
    ).rejects.toThrow(new UnauthorizedException('Email atau password salah'));
  });

  it('should return tokens on successful login', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: true }),
    });
    mockCtx.prisma.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: 'hashedpassword',
    } as any);
    
    (argon2.verify as jest.Mock).mockResolvedValue(true);

    const result = await service.execute({ email: 'test@example.com', password: 'correctpassword', turnstileToken: 'valid' });
    
    expect(result).toEqual({ accessToken: 'access', refreshToken: 'refresh' });
    expect(mockTokenService.generateAndSaveTokens).toHaveBeenCalledWith('1', 'test@example.com');
  });
});
