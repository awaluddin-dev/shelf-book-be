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
    // 1. Validate Turnstile Captcha
    const turnstileSecret =
      process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';

    try {
      const verifyRes = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: dto.turnstileToken,
          }),
        },
      );

      const verifyData = (await verifyRes.json()) as { success: boolean };
      if (!verifyData.success) {
        throw new UnauthorizedException(
          'Captcha validation failed. Are you a bot?',
        );
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Failed to verify captcha');
    }

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
