import { Test, TestingModule } from '@nestjs/testing';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException } from '@nestjs/common';

describe('ResumeController', () => {
  let controller: ResumeController;
  let service: ResumeService;

  const mockResumeDoc = {
    id: 'doc-123',
    title: 'Awaluddin CV',
    description: 'CV 2026',
    fileType: 'pdf',
    fileName: 'cv.pdf',
    storedName: '123-cv.pdf',
    filePath: 'uploads/documents/123-cv.pdf',
    fileSize: 1024,
    mimeType: 'application/pdf',
    isPrimary: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockResumeService = {
    getAll: jest.fn().mockResolvedValue([mockResumeDoc]),
    getDocumentById: jest.fn().mockResolvedValue(mockResumeDoc),
    getPrimary: jest.fn().mockResolvedValue(mockResumeDoc),
    uploadDocument: jest.fn().mockResolvedValue(mockResumeDoc),
    updateDocument: jest.fn().mockResolvedValue(mockResumeDoc),
    deleteDocument: jest.fn().mockResolvedValue({ success: true }),
    getFileForDownload: jest.fn().mockResolvedValue({
      stream: {} as any,
      fileName: 'cv.pdf',
      mimeType: 'application/pdf',
      fileSize: 1024,
    }),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResumeController],
      providers: [
        { provide: ResumeService, useValue: mockResumeService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    controller = module.get<ResumeController>(ResumeController);
    service = module.get<ResumeService>(ResumeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all documents', async () => {
    const result = await controller.getAllDocuments();
    expect(result).toEqual([mockResumeDoc]);
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should get primary document', async () => {
    const result = await controller.getPrimaryDocument();
    expect(result).toEqual(mockResumeDoc);
    expect(service.getPrimary).toHaveBeenCalled();
  });

  it('should get document by id', async () => {
    const result = await controller.getDocumentById('doc-123');
    expect(result).toEqual(mockResumeDoc);
    expect(service.getDocumentById).toHaveBeenCalledWith('doc-123');
  });

  it('should throw BadRequestException if upload is not multipart', async () => {
    const mockReq: any = {
      isMultipart: () => false,
    };
    await expect(controller.uploadDocument(mockReq)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException if no file uploaded', async () => {
    const mockReq: any = {
      isMultipart: () => true,
      file: async () => null,
    };
    await expect(controller.uploadDocument(mockReq)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should upload document successfully', async () => {
    const mockReq: any = {
      isMultipart: () => true,
      file: async () => ({
        filename: 'cv.pdf',
        mimetype: 'application/pdf',
        fields: {
          title: { value: 'Awaluddin CV' },
          description: { value: 'CV 2026' },
          isPrimary: { value: 'true' },
        },
      }),
    };

    const result = await controller.uploadDocument(mockReq);
    expect(result).toEqual(mockResumeDoc);
    expect(service.uploadDocument).toHaveBeenCalled();
  });

  it('should throw BadRequestException if title is missing during upload', async () => {
    const mockReq: any = {
      isMultipart: () => true,
      file: async () => ({
        filename: 'cv.pdf',
        mimetype: 'application/pdf',
        fields: {
          description: { value: 'No title' },
        },
      }),
    };

    await expect(controller.uploadDocument(mockReq)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update document with multipart file', async () => {
    const mockReq: any = {
      isMultipart: () => true,
      file: async () => ({
        filename: 'new-cv.pdf',
        mimetype: 'application/pdf',
        fields: {
          title: { value: 'Updated CV' },
          description: { value: 'Updated description' },
          isPrimary: { value: 'true' },
        },
      }),
    };

    const result = await controller.updateDocument('doc-123', mockReq, {});
    expect(result).toEqual(mockResumeDoc);
    expect(service.updateDocument).toHaveBeenCalledWith(
      'doc-123',
      {
        title: 'Updated CV',
        description: 'Updated description',
        isPrimary: true,
      },
      expect.anything(),
    );
  });

  it('should update document without multipart', async () => {
    const mockReq: any = {
      isMultipart: () => false,
    };
    const body = { title: 'New Title' };
    const result = await controller.updateDocument('doc-123', mockReq, body);
    expect(result).toEqual(mockResumeDoc);
    expect(service.updateDocument).toHaveBeenCalledWith('doc-123', body);
  });

  it('should download document file', async () => {
    const mockReply: any = {
      header: jest.fn().mockReturnThis(),
      send: jest.fn().mockImplementation((val) => val),
    };

    await controller.downloadDocument('doc-123', mockReply);
    expect(mockReply.header).toHaveBeenCalledWith(
      'Content-Type',
      'application/pdf',
    );
    expect(mockReply.header).toHaveBeenCalledWith(
      'Content-Disposition',
      'inline; filename="cv.pdf"',
    );
    expect(mockReply.send).toHaveBeenCalled();
  });

  it('should delete document', async () => {
    const result = await controller.deleteDocument('doc-123');
    expect(result).toEqual({ success: true });
    expect(service.deleteDocument).toHaveBeenCalledWith('doc-123');
  });
});
