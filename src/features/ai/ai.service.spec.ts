import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { LlmProviderService } from './providers/llm-provider.service';
import { ExplainProjectDto } from './dto/explain-project.dto';

describe('AiService', () => {
  let service: AiService;
  let llmProvider: jest.Mocked<LlmProviderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: LlmProviderService,
          useValue: { streamCompletion: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    llmProvider = module.get(LlmProviderService) as any;
  });

  describe('streamProjectExplanation', () => {
    it('should call streamCompletion with correct prompt', async () => {
      llmProvider.streamCompletion.mockResolvedValue('mock_response' as any);

      const dto: ExplainProjectDto = {
        id: '123',
        title: 'T',
        description: 'D',
        tech_stack: ['A', 'B'],
        metrics: 'M',
        role: 'R'
      } as any;

      const result = await service.streamProjectExplanation(dto);

      expect(llmProvider.streamCompletion).toHaveBeenCalled();
      const args = llmProvider.streamCompletion.mock.calls[0][0];
      expect(args[0].content).toContain('Title: T');
      expect(args[0].content).toContain('Tech stack: A, B');
      expect(args[0].content).toContain('Metrics: M');
      expect(args[0].content).toContain('Role: R');
      expect(result).toBe('mock_response');
    });

    it('should handle missing metrics and role', async () => {
      llmProvider.streamCompletion.mockResolvedValue('mock_response' as any);

      const dto: ExplainProjectDto = {
        id: '123',
        title: 'T',
        description: 'D',
        tech_stack: ['A', 'B'],
      } as any;

      const result = await service.streamProjectExplanation(dto);

      expect(llmProvider.streamCompletion).toHaveBeenCalled();
      const args = llmProvider.streamCompletion.mock.calls[0][0];
      expect(args[0].content).not.toContain('Metrics:');
      expect(args[0].content).not.toContain('Role:');
    });
  });
});
