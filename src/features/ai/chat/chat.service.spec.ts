import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { RagRetrievalService } from './rag-retrieval.service';
import { LlmProviderService } from '../providers/llm-provider.service';
import { ChatDto } from './chat.dto';

describe('ChatService', () => {
  let service: ChatService;
  let rag: jest.Mocked<RagRetrievalService>;
  let llm: jest.Mocked<LlmProviderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: RagRetrievalService,
          useValue: { retrieve: jest.fn() },
        },
        {
          provide: LlmProviderService,
          useValue: { streamCompletion: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    rag = module.get(RagRetrievalService) as any;
    llm = module.get(LlmProviderService) as any;
  });

  describe('streamChat', () => {
    it('should handle chat without context', async () => {
      rag.retrieve.mockResolvedValue([]);
      llm.streamCompletion.mockResolvedValue('mock_response' as any);

      const dto: ChatDto = {
        messages: [{ role: 'user', content: 'hello' }],
      };

      await service.streamChat(dto);

      expect(rag.retrieve).toHaveBeenCalledWith('hello');
      expect(llm.streamCompletion).toHaveBeenCalled();
      const args = llm.streamCompletion.mock.calls[0][0];
      expect(args[0].content).toContain('NO_CONTEXT_FOUND');
      expect(args[args.length - 1].content).toBe('hello');
    });

    it('should handle chat with context and history', async () => {
      rag.retrieve.mockResolvedValue([
        { source: 'skills', content: 'TypeScript' }
      ]);
      llm.streamCompletion.mockResolvedValue('mock_response' as any);

      const dto: ChatDto = {
        messages: [
          { role: 'user', content: 'a' },
          { role: 'assistant', content: 'b' },
          { role: 'user', content: 'c' },
          { role: 'assistant', content: 'd' },
          { role: 'user', content: 'e' },
          { role: 'assistant', content: 'f' },
          { role: 'user', content: 'g' },
        ],
      };

      await service.streamChat(dto);

      expect(rag.retrieve).toHaveBeenCalledWith('g');
      const args = llm.streamCompletion.mock.calls[0][0];
      expect(args[0].content).toContain('[SKILLS]\nTypeScript');
      
      // system, assistant, c, d, e, f, g (c,d,e,f is slice(-5, -1))
      expect(args.length).toBe(7);
      expect(args[2].content).toBe('c');
      expect(args[3].content).toBe('d');
      expect(args[4].content).toBe('e');
      expect(args[5].content).toBe('f');
      expect(args[6].content).toBe('g');
    });
  });
});
