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
@ApiResponse({
  status: 400,
  description: 'Bad Request',
  schema: {
    example: {
      statusCode: 400,
      message: ['Validation failed'],
      error: 'Bad Request',
    },
  },
})
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
  schema: {
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized',
    },
  },
})
@ApiResponse({
  status: 403,
  description: 'Forbidden',
  schema: {
    example: {
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
    },
  },
})
@ApiResponse({
  status: 404,
  description: 'Not Found',
  schema: {
    example: {
      statusCode: 404,
      message: 'Resource not found',
      error: 'Not Found',
    },
  },
})
@ApiResponse({
  status: 429,
  description: 'Too Many Requests',
  schema: {
    example: {
      statusCode: 429,
      message: 'Too many requests, please try again later.',
      error: 'Too Many Requests',
    },
  },
})
@ApiResponse({
  status: 500,
  description: 'Internal Server Error',
  schema: { example: { statusCode: 500, message: 'Internal server error' } },
})
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
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
