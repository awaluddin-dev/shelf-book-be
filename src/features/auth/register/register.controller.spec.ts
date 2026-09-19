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
    it('should throw ForbiddenException as public registration is disabled', async () => {
      const dto: RegisterDto = {
        name: 'Test',
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(controller.register(dto)).rejects.toThrow(
        'Public registration is permanently disabled on this instance.',
      );
    });
  });
});
