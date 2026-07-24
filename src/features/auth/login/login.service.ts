import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from '../shared/token.service';
import { LoginDto } from './login.dto';
import * as argon2 from 'argon2';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import Redis from 'ioredis';
import { Inject } from '@nestjs/common';
@Injectable()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    @Inject(REDIS_CLIENT) private redis: Redis,
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

    const attemptsKey = `login_attempts:${dto.email}`;
    const attempts = await this.redis.get(attemptsKey);
    
    if (attempts && parseInt(attempts) >= 3) {
      throw new UnauthorizedException('Too many failed login attempts. Please try again in 15 minutes.');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      await this.redis.incr(attemptsKey);
      await this.redis.expire(attemptsKey, 15 * 60); // 15 minutes
      throw new UnauthorizedException('Email atau password salah');
    }

    const pwMatches = await argon2.verify(user.password, dto.password);
    if (!pwMatches) {
      await this.redis.incr(attemptsKey);
      await this.redis.expire(attemptsKey, 15 * 60); // 15 minutes
      throw new UnauthorizedException('Email atau password salah');
    }

    // Success login, clear attempts
    await this.redis.del(attemptsKey);

    return this.tokenService.generateAndSaveTokens(user.id, user.email);
  }
}
