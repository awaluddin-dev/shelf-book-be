import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import * as crypto from 'crypto';

@Injectable()
export class RateLimitService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  /**
   * Checks if the IP or ETag has already submitted within the last 24 hours.
   * Throws a 429 HttpException if limit exceeded.
   */
  async checkLimit(req: any) {
    const ip =
      (req.headers['x-forwarded-for'] as string) || req.ip || req.socket.remoteAddress || 'unknown';
    const etag = req.headers['x-submit-etag'] as string;

    const ipKey = `rate_limit:ip:${ip}`;
    if (await this.redis.get(ipKey)) {
      throw new HttpException(
        'Anda telah mengirimkan data hari ini. Silakan coba lagi besok.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (etag) {
      const etagKey = `rate_limit:etag:${etag}`;
      if (await this.redis.get(etagKey)) {
        throw new HttpException(
          'Anda telah mengirimkan data hari ini. Silakan coba lagi besok.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }
  }

  /**
   * Sets the rate limit for the given request for 24 hours and attaches the ETag to the response.
   */
  async setLimit(req: any, res: any) {
    const ip =
      (req.headers['x-forwarded-for'] as string) || req.ip || req.socket.remoteAddress || 'unknown';
    
    // Generate new ETag
    const newEtag = crypto.randomUUID();
    
    const ttlSeconds = 86400; // 24 hours

    const ipKey = `rate_limit:ip:${ip}`;
    await this.redis.set(ipKey, 'true', 'EX', ttlSeconds);

    const etagKey = `rate_limit:etag:${newEtag}`;
    await this.redis.set(etagKey, 'true', 'EX', ttlSeconds);

    // Send ETag to client
    res.header('X-Submit-ETag', newEtag);
    
    // Also expose the header so CORS won't block the frontend from reading it
    res.header('Access-Control-Expose-Headers', 'X-Submit-ETag');
  }
}
