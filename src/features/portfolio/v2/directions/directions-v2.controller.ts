import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DirectionsV2Service } from './directions-v2.service';
import {
  CreateDirectionV2Dto,
  UpdateDirectionV2Dto,
  CreateYouTubeVideoV2Dto,
  UpdateYouTubeVideoV2Dto,
} from './directions-v2.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@ApiTags('Portfolio V2 - Directions & Roadmap')
@ApiGlobalResponses()
@Controller('v2/directions')
export class DirectionsV2Controller {
  constructor(private readonly directionsService: DirectionsV2Service) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('cache_directions_v2')
  @ApiOperation({ summary: 'Retrieve all V2 directions, grouped by current and future quarters' })
  @ApiResponse({
    status: 200,
    description: 'Directions successfully retrieved.',
  })
  async findAll() {
    return await this.directionsService.findGrouped();
  }

  @Get('list')
  @ApiOperation({ summary: 'Retrieve raw directions list' })
  @ApiQuery({ name: 'type', required: false, enum: ['current', 'future'] })
  async findList(@Query('type') type?: string) {
    return await this.directionsService.findAll(type);
  }

  @Get('devto')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('cache_directions_devto')
  @ApiOperation({ summary: 'Retrieve published articles from Dev.to' })
  @ApiQuery({ name: 'username', required: false })
  async getDevTo(@Query('username') username?: string) {
    return await this.directionsService.getDevToArticles(username || 'awaluddin');
  }

  @Get('youtube')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('cache_directions_youtube')
  @ApiOperation({ summary: 'Retrieve curated YouTube channel videos' })
  async getYouTube() {
    return await this.directionsService.getYouTubeVideos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single direction item' })
  async findOne(@Param('id') id: string) {
    return await this.directionsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new direction item' })
  @ApiResponse({
    status: 201,
    description: 'Direction item successfully created.',
  })
  async create(@Body() body: CreateDirectionV2Dto) {
    return await this.directionsService.create(body);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing direction item' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateDirectionV2Dto,
  ) {
    return await this.directionsService.update(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a direction item' })
  async delete(@Param('id') id: string) {
    return await this.directionsService.delete(id);
  }

  // YouTube Video Admin Endpoints
  @UseGuards(JwtGuard)
  @Post('youtube')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a YouTube video item' })
  async createVideo(@Body() body: CreateYouTubeVideoV2Dto) {
    return await this.directionsService.createYouTubeVideo(body);
  }

  @UseGuards(JwtGuard)
  @Patch('youtube/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a YouTube video item' })
  async updateVideo(
    @Param('id') id: string,
    @Body() body: UpdateYouTubeVideoV2Dto,
  ) {
    return await this.directionsService.updateYouTubeVideo(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('youtube/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a YouTube video item' })
  async deleteVideo(@Param('id') id: string) {
    return await this.directionsService.deleteYouTubeVideo(id);
  }
}
