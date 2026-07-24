import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenController } from './refresh-token.controller';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshDto } from './refresh-token.dto';

describe('RefreshTokenController', () => {
  let controller: RefreshTokenController;
  let service: RefreshTokenService;

  beforeEach(async () => {
    const mockRefreshTokenService = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefreshTokenController],
      providers: [
        {
          provide: RefreshTokenService,
          useValue: mockRefreshTokenService,
        },
      ],
    }).compile();

    controller = module.get<RefreshTokenController>(RefreshTokenController);
    service = module.get<RefreshTokenService>(RefreshTokenService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('refreshToken', () => {
    it('should call refreshTokenService.execute with correct parameters', async () => {
      const dto: RefreshDto = { refreshToken: 'some-refresh-token' };
      const expectedResult = {
        access_token: 'new-access',
        refresh_token: 'new-refresh',
      };

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.refreshToken(dto);

      expect(service.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });
});
