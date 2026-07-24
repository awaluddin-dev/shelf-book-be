import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { RegisterDto } from './register.dto';

describe('RegisterController', () => {
  let controller: RegisterController;
  let service: RegisterService;

  beforeEach(async () => {
    const mockRegisterService = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [
        {
          provide: RegisterService,
          useValue: mockRegisterService,
        },
      ],
    }).compile();

    controller = module.get<RegisterController>(RegisterController);
    service = module.get<RegisterService>(RegisterService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call registerService.execute with correct parameters', async () => {
      const dto: RegisterDto = {
        name: 'Test',
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResult = {
        id: 'user1',
        name: 'Test',
        email: 'test@example.com',
        createdAt: new Date(),
      };

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.register(dto);

      expect(service.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });
});
