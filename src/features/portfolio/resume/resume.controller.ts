import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import {
  CreateResumeDto,
  UpdateResumeDto,
  ResumeDocumentResponseDto,
} from './resume.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import type { FastifyRequest, FastifyReply } from 'fastify';

@ApiTags('Resume Documents')
@ApiGlobalResponses()
@Controller('resume/documents')
export class ResumeController {
  constructor(
    private readonly resumeService: ResumeService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  // 1. GET ALL
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('cache_resume_documents')
  @ApiOperation({ summary: 'Retrieve all resume documents' })
  @ApiResponse({
    status: 200,
    description: 'List of resume documents retrieved successfully.',
    type: [ResumeDocumentResponseDto],
  })
  async getAllDocuments() {
    return await this.resumeService.getAll();
  }

  // 2. GET PRIMARY
  @Get('primary')
  @ApiOperation({ summary: 'Retrieve primary or most recent resume document' })
  @ApiResponse({
    status: 200,
    description: 'Primary resume document retrieved successfully.',
    type: ResumeDocumentResponseDto,
  })
  async getPrimaryDocument() {
    return await this.resumeService.getPrimary();
  }

  // 2b. DOWNLOAD OR VIEW PRIMARY FILE
  @Get('primary/download')
  @ApiOperation({ summary: 'Download or view primary resume document file (.pdf / .md)' })
  @ApiResponse({
    status: 200,
    description: 'Binary primary document file stream.',
  })
  async downloadPrimaryDocument(@Res() reply: FastifyReply) {
    const primary = await this.resumeService.getPrimary();
    if (!primary) {
      throw new BadRequestException('No resume document found');
    }
    const fileData = await this.resumeService.getFileForDownload(primary.id);

    reply.header('Content-Type', fileData.mimeType);
    reply.header(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(fileData.fileName)}"`,
    );
    reply.header('Content-Length', fileData.fileSize);

    return reply.send(fileData.stream);
  }

  // 3. GET BY ID
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve resume document metadata by ID' })
  @ApiResponse({
    status: 200,
    description: 'Document details retrieved successfully.',
    type: ResumeDocumentResponseDto,
  })
  async getDocumentById(@Param('id') id: string) {
    return await this.resumeService.getDocumentById(id);
  }

  // 4. DOWNLOAD OR VIEW FILE
  @Get(':id/download')
  @ApiOperation({ summary: 'Download or view resume document file (.pdf / .md)' })
  @ApiResponse({
    status: 200,
    description: 'Binary document file stream.',
  })
  async downloadDocument(
    @Param('id') id: string,
    @Res() reply: FastifyReply,
  ) {
    const fileData = await this.resumeService.getFileForDownload(id);

    reply.header('Content-Type', fileData.mimeType);
    reply.header(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(fileData.fileName)}"`,
    );
    reply.header('Content-Length', fileData.fileSize);

    return reply.send(fileData.stream);
  }

  // 5. UPLOAD NEW RESUME DOCUMENT (PDF / MD)
  @UseGuards(JwtGuard)
  @Post()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload a new resume document (.pdf or .md)',
    description:
      'Uploads a resume file (.pdf or .md) along with metadata like title and description.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'title'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Document file (.pdf or .md)',
        },
        title: {
          type: 'string',
          example: 'Awaluddin - Fullstack Engineer Resume',
        },
        description: {
          type: 'string',
          example: 'Resume focused on NestJS and AI Integrations',
        },
        isPrimary: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Document uploaded and created successfully.',
    type: ResumeDocumentResponseDto,
  })
  async uploadDocument(@Req() req: FastifyRequest) {
    if (!req.isMultipart()) {
      throw new BadRequestException('Request must be multipart/form-data');
    }

    const file = await req.file();
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Extract fields from multipart form
    const fields = file.fields as Record<string, { value?: unknown } | undefined>;
    const title = typeof fields.title?.value === 'string' ? fields.title.value : undefined;
    const description = typeof fields.description?.value === 'string' ? fields.description.value : undefined;
    const isPrimaryRaw = fields.isPrimary?.value;
    const isPrimaryValue =
      isPrimaryRaw === 'true' || isPrimaryRaw === true;

    if (!title || !title.trim()) {
      throw new BadRequestException('Title is required');
    }

    const metadata: CreateResumeDto = {
      title: title.trim(),
      description: description ? description.trim() : undefined,
      isPrimary: isPrimaryValue,
    };

    const doc = await this.resumeService.uploadDocument(metadata, file);
    try {
      await this.cacheManager.del('cache_resume_documents');
    } catch {
      // ignore
    }
    return doc;
  }

  // 6. UPDATE RESUME DOCUMENT (Metadata and optional file replace)
  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiOperation({
    summary: 'Update resume document metadata or replace file',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Optional replacement file (.pdf or .md)',
        },
        title: {
          type: 'string',
          example: 'Awaluddin - Lead Backend Engineer',
        },
        description: {
          type: 'string',
          example: 'Updated description',
        },
        isPrimary: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Document updated successfully.',
    type: ResumeDocumentResponseDto,
  })
  async updateDocument(
    @Param('id') id: string,
    @Req() req: FastifyRequest,
    @Body() body: UpdateResumeDto,
  ) {
    let result: ResumeDocumentResponseDto;
    if (req.isMultipart()) {
      const file = await req.file();
      const fields = (file?.fields || {}) as Record<string, { value?: unknown } | undefined>;

      const titleRaw = fields.title?.value;
      const title = typeof titleRaw === 'string' ? titleRaw.trim() : undefined;
      const descRaw = fields.description?.value;
      const description = typeof descRaw === 'string' ? descRaw.trim() : undefined;
      const isPrimaryRaw = fields.isPrimary?.value;
      const isPrimary =
        isPrimaryRaw !== undefined
          ? isPrimaryRaw === 'true' || isPrimaryRaw === true
          : undefined;

      const metadata: UpdateResumeDto = {
        title,
        description,
        isPrimary,
      };

      result = await this.resumeService.updateDocument(id, metadata, file || undefined);
    } else {
      result = await this.resumeService.updateDocument(id, body);
    }

    try {
      await this.cacheManager.del('cache_resume_documents');
    } catch {
      // ignore
    }
    return result;
  }

  // 7. DELETE RESUME DOCUMENT
  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a resume document' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Document deleted successfully.',
    schema: { example: { success: true } },
  })
  async deleteDocument(@Param('id') id: string): Promise<{ success: boolean }> {
    const result = await this.resumeService.deleteDocument(id);
    try {
      await this.cacheManager.del('cache_resume_documents');
    } catch {
      // ignore
    }
    return result;
  }
}
