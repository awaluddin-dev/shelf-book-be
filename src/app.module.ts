import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { AuthFeatureModule } from './features/auth/auth-feature.module';
import { PortfolioModule } from './features/portfolio/portfolio.module';
import { GithubModule } from './features/github/github.module';
import { ContactModule } from './features/contact/contact.module';
import { HealthModule } from './health/health.module';
import { AiModule } from './features/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
  providers: [],
})
export class AppModule {}
