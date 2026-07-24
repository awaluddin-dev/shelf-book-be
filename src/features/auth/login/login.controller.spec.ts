import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { LoginDto } from './login.dto';

describe('LoginController', () => {
  let controller: LoginController;
  let service: LoginService;

  beforeEach(async () => {
    const mockLoginService = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginService,
          useValue: mockLoginService,
        },
      ],
    }).compile();

    controller = module.get<LoginController>(LoginController);
    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call loginService.execute with correct parameters', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: 'password123' };
      const expectedResult = { access_token: 'access', refresh_token: 'refresh' };
      
      jest.spyOn(service, 'execute').mockResolvedValue(expectedResult as any);

      const result = await controller.login(dto);

      expect(service.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });
});
