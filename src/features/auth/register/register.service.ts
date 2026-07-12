import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './register.dto';
import * as argon2 from 'argon2';
import { Prisma } from '@prisma/client';

@Injectable()
export class RegisterService {
  constructor(private prisma: PrismaService) {}

  async execute(dto: RegisterDto) {
    const hash = await argon2.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hash,
        },
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };
    } catch (error) {
      console.error('ERROR REGISTER:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email sudah terdaftar');
        }
      }

      throw new InternalServerErrorException('Gagal Membuat User');
    }
  }
}
