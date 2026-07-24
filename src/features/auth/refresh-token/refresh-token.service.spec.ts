import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenService } from './refresh-token.service';
import { TokenService } from '../shared/token.service';
import { RefreshDto } from './refresh-token.dto';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let tokenService: TokenService;

  beforeEach(async () => {
    const mockTokenService = {
      verifyRefreshToken: jest.fn(),
      generateAndSaveTokens: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

    service = module.get<RefreshTokenService>(RefreshTokenService);
    tokenService = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should verify token and generate new ones', async () => {
      const dto: RefreshDto = { refreshToken: 'old-refresh' };
      const payload = { sub: 'user1', email: 'test@example.com' };
      const tokens = {
        access_token: 'new-access',
        refresh_token: 'new-refresh',
      };

      jest.spyOn(tokenService, 'verifyRefreshToken').mockResolvedValue(payload);
      jest
        .spyOn(tokenService, 'generateAndSaveTokens')
        .mockResolvedValue(tokens);

      const result = await service.execute(dto);

      expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(
        dto.refreshToken,
      );
      expect(tokenService.generateAndSaveTokens).toHaveBeenCalledWith(
        payload.sub,
        payload.email,
      );
      expect(result).toEqual(tokens);
    });
  });
});
