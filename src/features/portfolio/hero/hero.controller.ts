import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { HeroService } from './hero.service';
import {
  PortfolioStatusDto,
  HeroConfigDto,
  MetricDto,
  HeroResponseDto,
  PortfolioStatusResponseDto,
} from './hero.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Hero')
@ApiGlobalResponses()
@Controller()
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  // STATUS
  @Get('status')
  @ApiOperation({ summary: 'Retrieve portfolio status' })
  @ApiResponse({
    status: 200,
    description: 'Portfolio status successfully retrieved.',
    type: PortfolioStatusResponseDto,
  })
  async getStatus() {
    return { status: await this.heroService.getStatus() };
  }

  @UseGuards(JwtGuard)
  @Post('status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update portfolio status' })
  @ApiResponse({
    status: 201,
    description: 'Portfolio status successfully updated.',
    type: PortfolioStatusResponseDto,
  })

  async updateStatus(@Body() body: PortfolioStatusDto) {
    return await this.heroService.updateStatus(body.status);
  }

  // HERO
  @Get('hero')
  @ApiOperation({ summary: 'Retrieve hero section data' })
  @ApiResponse({
    status: 200,
    description: 'Hero section data successfully retrieved.',
    type: HeroResponseDto,
  })
  async getHero() {
    const data = await this.heroService.getHero();
    return {
      heroConfig: data.heroConfig,
      metrics: data.metrics,
    };
  }

  @UseGuards(JwtGuard)
  @Patch('hero')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update hero section data' })
  @ApiResponse({
    status: 200,
    description: 'Hero section data successfully updated.',
    type: HeroResponseDto,
  })

  async updateHero(
    @Body()
    body: {
      heroConfig?: Partial<HeroConfigDto>;
      metrics?: MetricDto[];
    },
  ) {
    return await this.heroService.updateHero(body.heroConfig, body.metrics);
  }
}
