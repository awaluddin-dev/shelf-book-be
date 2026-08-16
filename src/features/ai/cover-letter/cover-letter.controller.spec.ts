import { Test, TestingModule } from '@nestjs/testing';
import { CoverLetterController } from './cover-letter.controller';
import { CoverLetterService } from './cover-letter.service';
import { Readable } from 'stream';

describe('CoverLetterController', () => {
  let controller: CoverLetterController;
  let service: CoverLetterService;

  const mockCoverLetterService = {
    streamCoverLetter: jest.fn(),
    streamDraftInquiry: jest.fn(),
  };

  const mockReply = () => {
    const reply: any = {};
    reply.header = jest.fn().mockReturnValue(reply);
    reply.send = jest.fn().mockReturnValue(reply);
    reply.status = jest.fn().mockReturnValue(reply);
    return reply;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoverLetterController],
      providers: [
        {
          provide: CoverLetterService,
          useValue: mockCoverLetterService,
        },
      ],
    }).compile();

    controller = module.get<CoverLetterController>(CoverLetterController);
    service = module.get<CoverLetterService>(CoverLetterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateCoverLetter', () => {
    it('should stream cover letter successfully', async () => {
      const dto = { jobDescription: 'test jd' };
      const reply = mockReply();
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue('test');
          controller.close();
        },
      });

      mockCoverLetterService.streamCoverLetter.mockResolvedValue({
        body: mockStream,
      });

      await controller.generateCoverLetter(dto, reply);

      expect(service.streamCoverLetter).toHaveBeenCalledWith(dto);
      expect(reply.header).toHaveBeenCalledWith(
        'Content-Type',
        'text/event-stream',
      );
      expect(reply.header).toHaveBeenCalledWith('Cache-Control', 'no-cache');
      expect(reply.header).toHaveBeenCalledWith('Connection', 'keep-alive');
      expect(reply.header).toHaveBeenCalledWith('X-Accel-Buffering', 'no');
      expect(reply.send).toHaveBeenCalled();

      const sentStream = reply.send.mock.calls[0][0];
      expect(sentStream).toBeInstanceOf(Readable);
    });

    it('should throw an error if body is null', async () => {
      const dto = { jobDescription: 'test jd' };
      const reply = mockReply();

      mockCoverLetterService.streamCoverLetter.mockResolvedValue({
        body: null,
      });

      await controller.generateCoverLetter(dto, reply);

      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        error: 'LLM response body is null',
      });
    });

    it('should handle service errors', async () => {
      const dto = { jobDescription: 'test jd' };
      const reply = mockReply();

      mockCoverLetterService.streamCoverLetter.mockRejectedValue(
        new Error('Service error'),
      );

      await controller.generateCoverLetter(dto, reply);

      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({ error: 'Service error' });
    });
  });

  describe('draftInquiry', () => {
    it('should stream draft inquiry successfully', async () => {
      const dto = { coverLetter: 'test cl' };
      const reply = mockReply();
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue('test');
          controller.close();
        },
      });

      mockCoverLetterService.streamDraftInquiry.mockResolvedValue({
        body: mockStream,
      });

      await controller.draftInquiry(dto, reply);

      expect(service.streamDraftInquiry).toHaveBeenCalledWith(dto);
      expect(reply.header).toHaveBeenCalledWith(
        'Content-Type',
        'text/event-stream',
      );
      expect(reply.send).toHaveBeenCalled();

      const sentStream = reply.send.mock.calls[0][0];
      expect(sentStream).toBeInstanceOf(Readable);
    });

    it('should throw an error if body is null', async () => {
      const dto = { coverLetter: 'test cl' };
      const reply = mockReply();

      mockCoverLetterService.streamDraftInquiry.mockResolvedValue({
        body: null,
      });

      await controller.draftInquiry(dto, reply);

      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        error: 'LLM response body is null',
      });
    });

    it('should handle service errors', async () => {
      const dto = { coverLetter: 'test cl' };
      const reply = mockReply();

      mockCoverLetterService.streamDraftInquiry.mockRejectedValue(
        new Error('Service error'),
      );

      await controller.draftInquiry(dto, reply);

      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({ error: 'Service error' });
    });
  });
});
