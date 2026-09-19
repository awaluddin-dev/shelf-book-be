import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HeroV2Service } from './hero-v2.service';
import { UpdateHeroV2Dto } from './hero-v2.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CacheInterceptor,
  CacheKey,
  CACHE_MANAGER,
} from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@ApiTags('Portfolio V2 - Hero')
@ApiGlobalResponses()
@Controller('v2/hero')
export class HeroV2Controller {
  constructor(
    private readonly heroService: HeroV2Service,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('cache_hero_v2')
  @ApiOperation({ summary: 'Retrieve V2 hero and metrics configuration' })
  @ApiResponse({
    status: 200,
    description: 'Hero configuration and metrics successfully retrieved.',
  })
  async getHero() {
    return await this.heroService.getHero();
  }

  @UseGuards(JwtGuard)
  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update V2 hero and metrics configuration' })
  @ApiResponse({
    status: 200,
    description: 'Hero configuration successfully updated.',
  })
  async updateHero(@Body() body: UpdateHeroV2Dto) {
    const result = await this.heroService.updateHero(
      body.heroConfig,
      body.metrics,
    );
    try {
      await this.cacheManager.del('cache_hero_v2');
      await this.cacheManager.del('cache_hero');
    } catch {
      // ignore cache eviction errors
    }
    return result;
  }
}
