import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { AuthFeatureModule } from './features/auth/auth-feature.module';
import { PortfolioModule } from './features/portfolio/portfolio.module';
import { GithubModule } from './features/github/github.module';
import { ContactModule } from './features/contact/contact.module';
import { HealthModule } from './health/health.module';
import { AiModule } from './features/ai/ai.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 1000 * 60 * 60,
      max: 100,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Pantau per 60 detik (1 menit)
        limit: 100, // Batas maksimal: 100 request per IP per menit
      },
    ]),
    RedisModule,
    PrismaModule,
    AuthFeatureModule,
    PortfolioModule,
    GithubModule,
    ContactModule,
    HealthModule,
    AiModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
