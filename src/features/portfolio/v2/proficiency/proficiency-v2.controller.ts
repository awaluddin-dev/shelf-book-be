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
import { ProficiencyV2Service } from './proficiency-v2.service';
import {
  CreateProficiencyPillarV2Dto,
  UpdateProficiencyPillarV2Dto,
} from './proficiency-v2.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@ApiTags('Portfolio V2 - Proficiency Pillars')
@ApiGlobalResponses()
@Controller('v2/proficiency')
export class ProficiencyV2Controller {
  constructor(private readonly proficiencyService: ProficiencyV2Service) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('cache_proficiency_v2')
  @ApiOperation({ summary: 'Retrieve all V2 proficiency pillars' })
  @ApiResponse({
    status: 200,
    description: 'Proficiency pillars successfully retrieved.',
  })
  async findAll() {
    return await this.proficiencyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single V2 proficiency pillar' })
  @ApiResponse({
    status: 200,
    description: 'Proficiency pillar successfully retrieved.',
  })
  async findOne(@Param('id') id: string) {
    return await this.proficiencyService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new V2 proficiency pillar' })
  @ApiResponse({
    status: 201,
    description: 'Proficiency pillar successfully created.',
  })
  async create(@Body() body: CreateProficiencyPillarV2Dto) {
    return await this.proficiencyService.create(body);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a V2 proficiency pillar' })
  @ApiResponse({
    status: 200,
    description: 'Proficiency pillar successfully updated.',
  })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProficiencyPillarV2Dto,
  ) {
    return await this.proficiencyService.update(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a V2 proficiency pillar' })
  @ApiResponse({
    status: 200,
    description: 'Proficiency pillar successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    return await this.proficiencyService.remove(id);
  }
}
