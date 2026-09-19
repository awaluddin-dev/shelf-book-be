import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ProjectsV2Service } from './projects-v2.service';
import { CreateProjectV2Dto, UpdateProjectV2Dto } from './projects-v2.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import type { FastifyRequest, FastifyReply } from 'fastify';

@ApiTags('Portfolio V2 - Projects')
@ApiGlobalResponses()
@Controller('v2/projects')
export class ProjectsV2Controller {
  constructor(private readonly projectsService: ProjectsV2Service) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('cache_projects_v2')
  @ApiOperation({ summary: 'Retrieve all V2 projects' })
  @ApiResponse({
    status: 200,
    description: 'Projects successfully retrieved.',
  })
  async findAll() {
    return await this.projectsService.findAll();
  }

  @Get('assets/:filename')
  @ApiOperation({ summary: 'Serve or stream uploaded project asset (architecture, preview, screenshot)' })
  @ApiResponse({
    status: 200,
    description: 'Project asset file stream.',
  })
  async getAsset(
    @Param('filename') filename: string,
    @Res() reply: FastifyReply,
  ) {
    const fileData = await this.projectsService.getFileForDownload(filename);

    reply.header('Content-Type', fileData.mimeType);
    reply.header(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(fileData.fileName)}"`,
    );
    reply.header('Content-Length', fileData.fileSize);
    reply.header('Cache-Control', 'public, max-age=31536000, immutable');

    return reply.send(fileData.stream);
  }

  @UseGuards(JwtGuard)
  @Post('upload')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload project media asset (architecture diagram, screenshot, GIF, etc.)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Asset file (image, gif, video, diagram pdf/png)',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Asset uploaded successfully.',
  })
  async uploadAsset(@Req() req: FastifyRequest) {
    if (!req.isMultipart()) {
      throw new BadRequestException('Request must be multipart/form-data');
    }

    const file = await req.file();
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return await this.projectsService.saveAsset(file);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single V2 project' })
  @ApiResponse({
    status: 200,
    description: 'Project successfully retrieved.',
  })
  async findOne(@Param('id') id: string) {
    return await this.projectsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new V2 project' })
  @ApiResponse({
    status: 201,
    description: 'Project successfully created.',
  })
  async create(@Body() body: CreateProjectV2Dto) {
    return await this.projectsService.create(body);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a V2 project' })
  @ApiResponse({
    status: 200,
    description: 'Project successfully updated.',
  })
  async update(@Param('id') id: string, @Body() body: UpdateProjectV2Dto) {
    return await this.projectsService.update(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a V2 project' })
  @ApiResponse({
    status: 200,
    description: 'Project successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    return await this.projectsService.remove(id);
  }
}

