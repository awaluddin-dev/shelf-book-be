import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from '../shared/token.service';
import { LoginDto } from './login.dto';
import * as argon2 from 'argon2';

@Injectable()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const pwMatches = await argon2.verify(user.password, dto.password);
    if (!pwMatches) {
      throw new UnauthorizedException('Email atau password salah');
    }

    return this.tokenService.generateAndSaveTokens(user.id, user.email);
  }
}
