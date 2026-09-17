import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ExperienceV2Service } from './experience-v2.service';
import {
  CreateCareerExperienceV2Dto,
  UpdateCareerExperienceV2Dto,
} from './experience-v2.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@ApiTags('Portfolio V2 - Career Experience')
@ApiGlobalResponses()
@Controller('v2/experience')
export class ExperienceV2Controller {
  constructor(private readonly experienceService: ExperienceV2Service) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('cache_experience_v2')
  @ApiOperation({ summary: 'Retrieve all V2 career experiences' })
  @ApiResponse({
    status: 200,
    description: 'Career experiences successfully retrieved.',
  })
  async findAll() {
    return await this.experienceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single V2 career experience' })
  @ApiResponse({
    status: 200,
    description: 'Career experience successfully retrieved.',
  })
  async findOne(@Param('id') id: string) {
    return await this.experienceService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new V2 career experience' })
  @ApiResponse({
    status: 201,
    description: 'Career experience successfully created.',
  })
  async create(@Body() body: CreateCareerExperienceV2Dto) {
    return await this.experienceService.create(body);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a V2 career experience' })
  @ApiResponse({
    status: 200,
    description: 'Career experience successfully updated.',
  })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateCareerExperienceV2Dto,
  ) {
    return await this.experienceService.update(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a V2 career experience' })
  @ApiResponse({
    status: 200,
    description: 'Career experience successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    return await this.experienceService.remove(id);
  }
}
