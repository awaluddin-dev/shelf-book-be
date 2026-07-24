import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { HeroService } from './hero.service';
import { PortfolioStatusDto, HeroConfigDto, MetricDto } from './hero.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Hero')
@Controller()
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  // STATUS
  @Get('status')
  async getStatus() {
    return { status: await this.heroService.getStatus() };
  }

  @UseGuards(JwtGuard)
  @Post('status')
  async updateStatus(@Body() body: PortfolioStatusDto) {
    return await this.heroService.updateStatus(body.status);
  }

  // HERO
  @Get('hero')
  async getHero() {
    const data = await this.heroService.getHero();
    return {
      heroConfig: data.heroConfig,
      metrics: data.metrics,
    };
  }

  @UseGuards(JwtGuard)
  @Patch('hero')
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
