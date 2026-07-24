import { Test, TestingModule } from '@nestjs/testing';
import { RegisterService } from './register.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './register.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { Prisma } from '@prisma/client';

jest.mock('argon2');

describe('RegisterService', () => {
  let service: RegisterService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should successfully register a user', async () => {
      const dto: RegisterDto = {
        name: 'Test',
        email: 'test@example.com',
        password: 'password',
      };
      const hashedPassword = 'hashedPassword';
      const createdUser = {
        id: '1',
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (argon2.hash as jest.Mock).mockResolvedValue(hashedPassword);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(createdUser);

      const result = await service.execute(dto);

      expect(argon2.hash).toHaveBeenCalledWith(dto.password);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: dto.email,
          name: dto.name,
          password: hashedPassword,
        },
      });
      expect(result).toEqual({
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        createdAt: createdUser.createdAt,
      });
    });

    it('should throw ConflictException if email is already registered', async () => {
      const dto: RegisterDto = {
        name: 'Test',
        email: 'test@example.com',
        password: 'password',
      };

      (argon2.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const prismaError = new Prisma.PrismaClientKnownRequestError('Error', {
        code: 'P2002',
        clientVersion: 'x.x.x',
      });
      jest.spyOn(prismaService.user, 'create').mockRejectedValue(prismaError);

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(service.execute(dto)).rejects.toThrow(ConflictException);
      await expect(service.execute(dto)).rejects.toThrow(
        'Email sudah terdaftar',
      );

      consoleSpy.mockRestore();
    });

    it('should throw InternalServerErrorException for other prisma errors', async () => {
      const dto: RegisterDto = {
        name: 'Test',
        email: 'test@example.com',
        password: 'password',
      };

      (argon2.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const prismaError = new Prisma.PrismaClientKnownRequestError('Error', {
        code: 'P2000',
        clientVersion: 'x.x.x',
      });
      jest.spyOn(prismaService.user, 'create').mockRejectedValue(prismaError);

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(service.execute(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.execute(dto)).rejects.toThrow('Gagal Membuat User');

      consoleSpy.mockRestore();
    });

    it('should throw InternalServerErrorException for generic errors', async () => {
      const dto: RegisterDto = {
        name: 'Test',
        email: 'test@example.com',
        password: 'password',
      };

      (argon2.hash as jest.Mock).mockResolvedValue('hashedPassword');

      jest
        .spyOn(prismaService.user, 'create')
        .mockRejectedValue(new Error('Some error'));

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(service.execute(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.execute(dto)).rejects.toThrow('Gagal Membuat User');

      consoleSpy.mockRestore();
    });
  });
});
