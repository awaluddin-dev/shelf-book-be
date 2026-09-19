export const CACHE_MANAGER = 'CACHE_MANAGER';
export const CACHE_KEY_METADATA = 'cache_module:cache_key';
export const CACHE_TTL_METADATA = 'cache_module:cache_ttl';

export const CacheKey = () => () => {};
export const CacheTTL = () => () => {};

export class CacheInterceptor {
  intercept(_context: unknown, next: { handle: () => unknown }): unknown {
    return next.handle();
  }
}

export class CacheModule {
  static register() {
    return {
      module: CacheModule,
    };
  }
  static registerAsync() {
    return {
      module: CacheModule,
    };
  }
}
