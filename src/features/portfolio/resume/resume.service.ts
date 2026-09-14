import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseCrudService } from 'src/common/services/base-crud.service';
import { CreateResumeDto, UpdateResumeDto } from './resume.dto';
import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import type { MultipartFile } from '@fastify/multipart';

@Injectable()
export class ResumeService extends BaseCrudService {
  private readonly uploadDir = path.resolve(process.cwd(), 'uploads', 'documents');
  private readonly allowedMimeTypes = ['application/pdf', 'text/markdown', 'text/x-markdown', 'text/plain'];
  private readonly allowedExtensions = ['.pdf', '.md'];

  constructor(private readonly prisma: PrismaService) {
    super();
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async getAll() {
    return this.prisma.resumeDocument.findMany({
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async getDocumentById(id: string) {
    return this.getById(this.prisma.resumeDocument, id);
  }

  async getPrimary() {
    const primary = await this.prisma.resumeDocument.findFirst({
      where: { isPrimary: true },
    });
    if (!primary) {
      // Fallback to most recent document
      return this.prisma.resumeDocument.findFirst({
        orderBy: { createdAt: 'desc' },
      });
    }
    return primary;
  }

  async uploadDocument(
    metadata: CreateResumeDto,
    file: MultipartFile,
  ) {
    this.validateFile(file);

    const ext = path.extname(file.filename).toLowerCase();
    const fileType = ext === '.pdf' ? 'pdf' : 'md';
    const storedName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const destinationPath = path.join(this.uploadDir, storedName);

    // Stream file to disk
    await pipeline(file.file, fs.createWriteStream(destinationPath));

    const stats = fs.statSync(destinationPath);

    // If marked as primary, unset other primaries
    if (metadata.isPrimary) {
      await this.prisma.resumeDocument.updateMany({
        where: { isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const relativePath = path.join('uploads', 'documents', storedName);

    return this.prisma.resumeDocument.create({
      data: {
        title: metadata.title,
        description: metadata.description || null,
        fileType,
        fileName: file.filename,
        storedName,
        filePath: relativePath,
        fileSize: stats.size,
        mimeType: file.mimetype || (fileType === 'pdf' ? 'application/pdf' : 'text/markdown'),
        isPrimary: Boolean(metadata.isPrimary),
      },
    });
  }

  async updateDocument(
    id: string,
    metadata: UpdateResumeDto,
    file?: MultipartFile,
  ) {
    const existing = await this.getByIdDelegate(id);

    let updatedFileData = {};

    if (file) {
      this.validateFile(file);

      const ext = path.extname(file.filename).toLowerCase();
      const fileType = ext === '.pdf' ? 'pdf' : 'md';
      const storedName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
      const destinationPath = path.join(this.uploadDir, storedName);

      await pipeline(file.file, fs.createWriteStream(destinationPath));
      const stats = fs.statSync(destinationPath);

      // Remove previous physical file
      this.removePhysicalFile(existing.storedName);

      updatedFileData = {
        fileType,
        fileName: file.filename,
        storedName,
        filePath: path.join('uploads', 'documents', storedName),
        fileSize: stats.size,
        mimeType: file.mimetype || (fileType === 'pdf' ? 'application/pdf' : 'text/markdown'),
      };
    }

    if (metadata.isPrimary) {
      await this.prisma.resumeDocument.updateMany({
        where: { id: { not: id }, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return this.prisma.resumeDocument.update({
      where: { id },
      data: {
        ...(metadata.title !== undefined && { title: metadata.title }),
        ...(metadata.description !== undefined && { description: metadata.description }),
        ...(metadata.isPrimary !== undefined && { isPrimary: metadata.isPrimary }),
        ...updatedFileData,
      },
    });
  }

  async deleteDocument(id: string) {
    const existing = await this.getByIdDelegate(id);

    // Remove physical file
    this.removePhysicalFile(existing.storedName);

    await this.prisma.resumeDocument.delete({
      where: { id },
    });

    return { success: true };
  }

  async getFileForDownload(id: string) {
    const doc = await this.getByIdDelegate(id);
    const fullPath = path.join(this.uploadDir, doc.storedName);

    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException(`Physical file for document ${id} not found on disk`);
    }

    return {
      stream: fs.createReadStream(fullPath),
      fileName: doc.fileName,
      mimeType: doc.mimeType,
      fileSize: doc.fileSize,
    };
  }

  private validateFile(file: MultipartFile): void {
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

  private removePhysicalFile(storedName: string): void {
    try {
      const filePath = path.join(this.uploadDir, storedName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch {
      // Ignored if file does not exist
    }
  }

  private async getByIdDelegate(id: string) {
    const item = await this.prisma.resumeDocument.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`Resume document with id ${id} not found`);
    }
    return item;
  }
}
