import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { RateLimitService } from './services/rate-limit.service';

@Module({
  imports: [RedisModule],
  providers: [RateLimitService],
  exports: [RateLimitService],
})
export class CommonModule {}
