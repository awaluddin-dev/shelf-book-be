import { Test, TestingModule } from '@nestjs/testing';
import { ResumeService } from './resume.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, createMockContext } from 'src/prisma/prisma.mock';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

jest.mock('fs', () => {
  const originalFs = jest.requireActual('fs');
  return {
    ...originalFs,
    existsSync: jest.fn().mockReturnValue(true),
    mkdirSync: jest.fn(),
    unlinkSync: jest.fn(),
    statSync: jest.fn().mockReturnValue({ size: 2048 }),
    createWriteStream: jest.fn().mockReturnValue({
      on: jest.fn(),
      once: jest.fn(),
      emit: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    }),
    createReadStream: jest.fn().mockReturnValue({
      pipe: jest.fn(),
    }),
  };
});

jest.mock('stream/promises', () => ({
  pipeline: jest.fn().mockResolvedValue(undefined),
}));

describe('ResumeService', () => {
  let service: ResumeService;
  let mockCtx: Context;

  const mockResumeDoc = {
    id: 'doc-1',
    title: 'Awaluddin Resume',
    description: 'Backend & AI',
    fileType: 'pdf',
    fileName: 'resume.pdf',
    storedName: '123-resume.pdf',
    filePath: 'uploads/documents/123-resume.pdf',
    fileSize: 2048,
    mimeType: 'application/pdf',
    isPrimary: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockCtx = createMockContext();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResumeService,
        {
          provide: PrismaService,
          useValue: mockCtx.prisma,
        },
      ],
    }).compile();

    service = module.get<ResumeService>(ResumeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should retrieve all documents ordered by isPrimary and createdAt', async () => {
      mockCtx.prisma.resumeDocument.findMany.mockResolvedValue([mockResumeDoc]);

      const result = await service.getAll();
      expect(result).toEqual([mockResumeDoc]);
      expect(mockCtx.prisma.resumeDocument.findMany).toHaveBeenCalledWith({
        orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
      });
    });
  });

  describe('getDocumentById', () => {
    it('should return document when found', async () => {
      mockCtx.prisma.resumeDocument.findUnique.mockResolvedValue(mockResumeDoc);

      const result = await service.getDocumentById('doc-1');
      expect(result).toEqual(mockResumeDoc);
      expect(mockCtx.prisma.resumeDocument.findUnique).toHaveBeenCalledWith({
        where: { id: 'doc-1' },
      });
    });

    it('should throw NotFoundException when not found', async () => {
      mockCtx.prisma.resumeDocument.findUnique.mockResolvedValue(null);

      await expect(service.getDocumentById('doc-999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getPrimary', () => {
    it('should return the primary document if exists', async () => {
      mockCtx.prisma.resumeDocument.findFirst.mockResolvedValue(mockResumeDoc);

      const result = await service.getPrimary();
      expect(result).toEqual(mockResumeDoc);
      expect(mockCtx.prisma.resumeDocument.findFirst).toHaveBeenCalledWith({
        where: { isPrimary: true },
      });
    });

    it('should fallback to most recent if no primary document', async () => {
      mockCtx.prisma.resumeDocument.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockResumeDoc);

      const result = await service.getPrimary();
      expect(result).toEqual(mockResumeDoc);
      expect(mockCtx.prisma.resumeDocument.findFirst).toHaveBeenCalledTimes(2);
    });
  });

  describe('uploadDocument', () => {
    it('should upload a PDF file and save record to DB', async () => {
      mockCtx.prisma.resumeDocument.updateMany.mockResolvedValue({ count: 1 });
      mockCtx.prisma.resumeDocument.create.mockResolvedValue(mockResumeDoc);

      const mockFile: any = {
        filename: 'my_resume.pdf',
        mimetype: 'application/pdf',
        file: {} as any,
      };

      const result = await service.uploadDocument(
        { title: 'My Resume', description: 'Desc', isPrimary: true },
        mockFile,
      );

      expect(result).toEqual(mockResumeDoc);
      expect(mockCtx.prisma.resumeDocument.updateMany).toHaveBeenCalledWith({
        where: { isPrimary: true },
        data: { isPrimary: false },
      });
      expect(mockCtx.prisma.resumeDocument.create).toHaveBeenCalled();
    });

    it('should upload a Markdown (.md) file successfully', async () => {
      mockCtx.prisma.resumeDocument.create.mockResolvedValue({
        ...mockResumeDoc,
        fileType: 'md',
        fileName: 'cv.md',
      });

      const mockFile: any = {
        filename: 'cv.md',
        mimetype: 'text/markdown',
        file: {} as any,
      };

      const result = await service.uploadDocument(
        { title: 'Markdown Resume', isPrimary: false },
        mockFile,
      );

      expect(result.fileType).toBe('md');
    });

    it('should throw BadRequestException if file is invalid extension', async () => {
      const mockFile: any = {
        filename: 'photo.jpg',
        mimetype: 'image/jpeg',
        file: {} as any,
      };

      await expect(
        service.uploadDocument({ title: 'Invalid' }, mockFile),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateDocument', () => {
    it('should update metadata only', async () => {
      mockCtx.prisma.resumeDocument.findUnique.mockResolvedValue(mockResumeDoc);
      mockCtx.prisma.resumeDocument.update.mockResolvedValue({
        ...mockResumeDoc,
        title: 'New Title',
      });

      const result = await service.updateDocument('doc-1', {
        title: 'New Title',
      });

      expect(result.title).toBe('New Title');
      expect(mockCtx.prisma.resumeDocument.update).toHaveBeenCalled();
    });

    it('should replace file when new file is provided', async () => {
      mockCtx.prisma.resumeDocument.findUnique.mockResolvedValue(mockResumeDoc);
      mockCtx.prisma.resumeDocument.update.mockResolvedValue({
        ...mockResumeDoc,
        fileName: 'new_cv.pdf',
      });

      const mockFile: any = {
        filename: 'new_cv.pdf',
        mimetype: 'application/pdf',
        file: {} as any,
      };

      const result = await service.updateDocument(
        'doc-1',
        { title: 'Updated CV' },
        mockFile,
      );

      expect(result.fileName).toBe('new_cv.pdf');
    });

    it('should unset previous primary if new document is set as primary on update', async () => {
      mockCtx.prisma.resumeDocument.findUnique.mockResolvedValue(mockResumeDoc);
      mockCtx.prisma.resumeDocument.updateMany.mockResolvedValue({ count: 1 });
      mockCtx.prisma.resumeDocument.update.mockResolvedValue({
        ...mockResumeDoc,
        isPrimary: true,
      });

      const result = await service.updateDocument('doc-1', {
        isPrimary: true,
      });

      expect(mockCtx.prisma.resumeDocument.updateMany).toHaveBeenCalledWith({
        where: { id: { not: 'doc-1' }, isPrimary: true },
        data: { isPrimary: false },
      });
      expect(result.isPrimary).toBe(true);
    });

    it('should throw BadRequestException if file is null/undefined when validating', async () => {
      await expect(
        service.uploadDocument({ title: 'No File' }, null as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteDocument', () => {
    it('should delete record and clean up file', async () => {
      mockCtx.prisma.resumeDocument.findUnique.mockResolvedValue(mockResumeDoc);
      mockCtx.prisma.resumeDocument.delete.mockResolvedValue(mockResumeDoc);

      const result = await service.deleteDocument('doc-1');
      expect(result).toEqual({ success: true });
      expect(mockCtx.prisma.resumeDocument.delete).toHaveBeenCalledWith({
        where: { id: 'doc-1' },
      });
    });

    it('should throw NotFoundException if document not found on delete', async () => {
      mockCtx.prisma.resumeDocument.findUnique.mockResolvedValue(null);

      await expect(service.deleteDocument('doc-999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getFileForDownload', () => {
    it('should return stream and file metadata', async () => {
      mockCtx.prisma.resumeDocument.findUnique.mockResolvedValue(mockResumeDoc);

      const result = await service.getFileForDownload('doc-1');
      expect(result.fileName).toBe('resume.pdf');
      expect(result.mimeType).toBe('application/pdf');
      expect(result.fileSize).toBe(2048);
    });

    it('should throw NotFoundException if physical file is missing', async () => {
      mockCtx.prisma.resumeDocument.findUnique.mockResolvedValue(mockResumeDoc);
      (fs.existsSync as jest.Mock).mockReturnValueOnce(false);

      await expect(service.getFileForDownload('doc-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('ensureUploadDirExists', () => {
    it('should create directory if it does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
      (service as any).ensureUploadDirExists();
      expect(fs.mkdirSync).toHaveBeenCalled();
    });
  });
});
