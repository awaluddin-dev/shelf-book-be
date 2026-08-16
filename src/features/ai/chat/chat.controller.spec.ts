import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatDto } from './chat.dto';
import { ReadableStream } from 'node:stream/web';

describe('ChatController', () => {
  let controller: ChatController;
  let chatService: jest.Mocked<ChatService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: { streamChat: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    chatService = module.get(ChatService);
  });

  describe('chat', () => {
    it('should throw if llmResponse body is null', async () => {
      const dto: ChatDto = { messages: [] };
      chatService.streamChat.mockResolvedValue({ body: null } as any);

      const reply = {
        header: jest.fn(),
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        raw: { write: jest.fn(), end: jest.fn() },
      } as any;

      await controller.chat(dto, reply);
      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        error: 'LLM response body is null',
      });
    });

    it('should simulate SSE if response is application/json', async () => {
      const dto: ChatDto = { messages: [] };
      const headers = new Headers();
      headers.set('content-type', 'application/json');
      chatService.streamChat.mockResolvedValue({
        body: {},
        headers,
        json: async () => ({
          choices: [{ message: { content: 'test content' } }],
        }),
      } as any);

      const reply = {
        header: jest.fn(),
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        raw: { write: jest.fn(), end: jest.fn() },
      } as any;

      await controller.chat(dto, reply);

      expect(reply.header).toHaveBeenCalledWith(
        'Content-Type',
        'text/event-stream',
      );
      expect(reply.raw.write).toHaveBeenCalledWith(
        `data: ${JSON.stringify({ choices: [{ delta: { content: 'test content' } }] })}\n\n`,
      );
      expect(reply.raw.write).toHaveBeenCalledWith(`data: [DONE]\n\n`);
      expect(reply.raw.end).toHaveBeenCalled();
    });

    it('should simulate SSE if response is application/json with delta content', async () => {
      const dto: ChatDto = { messages: [] };
      const headers = new Headers();
      headers.set('content-type', 'application/json');
      chatService.streamChat.mockResolvedValue({
        body: {},
        headers,
        json: async () => ({
          choices: [{ delta: { content: 'test content 2' } }],
        }),
      } as any);

      const reply = {
        header: jest.fn(),
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        raw: { write: jest.fn(), end: jest.fn() },
      } as any;

      await controller.chat(dto, reply);
      expect(reply.raw.write).toHaveBeenCalledWith(
        expect.stringContaining('test content 2'),
      );
    });

    it('should stream successfully', async () => {
      const mockBody = new ReadableStream({
        start(c: any) {
          c.close();
        },
      });

      const dto: ChatDto = { messages: [] };
      const headers = new Headers();
      headers.set('content-type', 'text/event-stream');
      chatService.streamChat.mockResolvedValue({
        body: mockBody,
        headers,
      } as any);

      const reply = {
        header: jest.fn(),
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        raw: { write: jest.fn(), end: jest.fn() },
      } as any;

      await controller.chat(dto, reply);

      expect(reply.header).toHaveBeenCalledWith(
        'Content-Type',
        'text/event-stream',
      );
      expect(reply.header).toHaveBeenCalledWith('X-Accel-Buffering', 'no');
      expect(reply.send).toHaveBeenCalled();
    });
  });
});
