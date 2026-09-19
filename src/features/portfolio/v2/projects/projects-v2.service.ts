import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectV2Dto, UpdateProjectV2Dto } from './projects-v2.dto';
import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import type { MultipartFile } from '@fastify/multipart';

@Injectable()
export class ProjectsV2Service {
  private readonly uploadDir = path.resolve(process.cwd(), 'uploads', 'projects');
  private readonly allowedMimeTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'application/pdf',
  ];
  private readonly allowedExtensions = [
    '.png',
    '.jpg',
    '.jpeg',
    '.webp',
    '.gif',
    '.svg',
    '.mp4',
    '.webm',
    '.pdf',
  ];

  constructor(private prisma: PrismaService) {
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async findAll() {
    const projects = await this.prisma.projectV2.findMany({
      orderBy: { order: 'asc' },
    });
    return { projects };
  }

  async findOne(id: string) {
    const project = await this.prisma.projectV2.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async create(data: CreateProjectV2Dto) {
    return await this.prisma.projectV2.create({
      data: {
        title: data.title,
        subtitle: data.subtitle ?? '',
        category: data.category,
        date: data.date,
        tags: data.tags ?? [],
        domainBadge: data.domainBadge,
        problem: data.problem,
        solution: data.solution,
        pipelineFlow: data.pipelineFlow ?? [],
        spineColor: data.spineColor ?? '#0f4c75',
        coverColor: data.coverColor ?? '#142028',
        spineText: data.spineText ?? data.title,
        github: data.github,
        demoUrl: data.demoUrl,
        stats: (data.stats ?? []) as Prisma.InputJsonValue,
        phases: (data.phases ?? []) as Prisma.InputJsonValue,
        markdown: data.markdown ?? '',
        order: data.order ?? 0,
        isFeatured: data.isFeatured ?? false,
        mediaType: data.mediaType,
        mediaUrl: data.mediaUrl,
        architectureDiagram: data.architectureDiagram,
        keyHighlights: data.keyHighlights ?? [],
      },
    });
  }

  async update(id: string, data: UpdateProjectV2Dto) {
    await this.findOne(id);
    return await this.prisma.projectV2.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.subtitle !== undefined && { subtitle: data.subtitle }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.date !== undefined && { date: data.date }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.domainBadge !== undefined && { domainBadge: data.domainBadge }),
        ...(data.problem !== undefined && { problem: data.problem }),
        ...(data.solution !== undefined && { solution: data.solution }),
        ...(data.pipelineFlow !== undefined && { pipelineFlow: data.pipelineFlow }),
        ...(data.spineColor !== undefined && { spineColor: data.spineColor }),
        ...(data.coverColor !== undefined && { coverColor: data.coverColor }),
        ...(data.spineText !== undefined && { spineText: data.spineText }),
        ...(data.github !== undefined && { github: data.github }),
        ...(data.demoUrl !== undefined && { demoUrl: data.demoUrl }),
        ...(data.stats !== undefined && {
          stats: data.stats as Prisma.InputJsonValue,
        }),
        ...(data.phases !== undefined && {
          phases: data.phases as Prisma.InputJsonValue,
        }),
        ...(data.markdown !== undefined && { markdown: data.markdown }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        ...(data.mediaType !== undefined && { mediaType: data.mediaType }),
        ...(data.mediaUrl !== undefined && { mediaUrl: data.mediaUrl }),
        ...(data.architectureDiagram !== undefined && { architectureDiagram: data.architectureDiagram }),
        ...(data.keyHighlights !== undefined && { keyHighlights: data.keyHighlights }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.projectV2.delete({
      where: { id },
    });
  }

  async saveAsset(file: MultipartFile) {
    this.validateAssetFile(file);

    const ext = path.extname(file.filename).toLowerCase();
    const storedName = `asset-${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const destinationPath = path.join(this.uploadDir, storedName);

    await pipeline(file.file, fs.createWriteStream(destinationPath));
    const stats = fs.statSync(destinationPath);

    return {
      fileName: file.filename,
      storedName,
      filePath: path.join('uploads', 'projects', storedName),
      url: `/api/v2/projects/assets/${storedName}`,
      fileSize: stats.size,
      mimeType: file.mimetype || 'application/octet-stream',
    };
  }

  async getFileForDownload(storedName: string) {
    // Prevent directory traversal
    const safeStoredName = path.basename(storedName);
    const fullPath = path.join(this.uploadDir, safeStoredName);

    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException(`File ${storedName} not found on disk`);
    }

    const stats = fs.statSync(fullPath);
    const ext = path.extname(safeStoredName).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.pdf': 'application/pdf',
    };

    return {
      stream: fs.createReadStream(fullPath),
      fileName: safeStoredName,
      mimeType: mimeMap[ext] || 'application/octet-stream',
      fileSize: stats.size,
    };
  }

  private validateAssetFile(file: MultipartFile): void {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const ext = path.extname(file.filename).toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        `Invalid file type '${ext}'. Allowed types are: ${this.allowedExtensions.join(', ')}`,
      );
    }
  }
}

