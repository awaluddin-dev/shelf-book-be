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
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@ApiTags('Portfolio V2 - Hero')
@ApiGlobalResponses()
@Controller('v2/hero')
export class HeroV2Controller {
  constructor(private readonly heroService: HeroV2Service) {}

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
    return await this.heroService.updateHero(body.heroConfig, body.metrics);
  }
}
