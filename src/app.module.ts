import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { AuthFeatureModule } from './features/auth/auth-feature.module';
import { PortfolioModule } from './features/portfolio/portfolio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
    PrismaModule,
    AuthFeatureModule,
    PortfolioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
