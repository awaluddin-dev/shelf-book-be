import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ExplainProjectDto } from './dto/explain-project.dto';

describe('AiController', () => {
  let controller: AiController;
  let aiService: jest.Mocked<AiService>;

  beforeEach(async () => {
    const aiServiceMock = {
      streamProjectExplanation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [{ provide: AiService, useValue: aiServiceMock }],
    }).compile();

    controller = module.get<AiController>(AiController);
    aiService = module.get(AiService) as any;
  });

  describe('explainProject', () => {
    it('should stream project explanation successfully', async () => {
      const dto: ExplainProjectDto = {
        id: '1',
        title: 'Project X',
        description: 'Test',
        tech_stack: ['A', 'B'],
        metrics: '',
        role: '',
      } as any;
      const { ReadableStream } = require('node:stream/web');
      const mockBody = new ReadableStream({ start(c: any) { c.close(); } });
      aiService.streamProjectExplanation.mockResolvedValue({ body: mockBody } as any);

      const reply = {
        header: jest.fn(),
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as any;

      await controller.explainProject(dto, reply);

      expect(reply.header).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
      expect(reply.header).toHaveBeenCalledWith('Cache-Control', 'no-cache');
      expect(reply.header).toHaveBeenCalledWith('Connection', 'keep-alive');
      expect(reply.header).toHaveBeenCalledWith('X-Accel-Buffering', 'no');
      expect(reply.send).toHaveBeenCalled();
    });

    it('should throw if llmResponse body is null', async () => {
      const dto: ExplainProjectDto = {} as any;
      aiService.streamProjectExplanation.mockResolvedValue({ body: null } as any);

      const reply = {
        header: jest.fn(),
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as any;

      await controller.explainProject(dto, reply);
      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({ error: 'LLM response body is null' });
    });

    it('should handle service errors', async () => {
      const dto: ExplainProjectDto = {} as any;
      aiService.streamProjectExplanation.mockRejectedValue(new Error('Service error'));

      const reply = {
        header: jest.fn(),
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as any;

      await controller.explainProject(dto, reply);
      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({ error: 'Service error' });
    });
  });
});
