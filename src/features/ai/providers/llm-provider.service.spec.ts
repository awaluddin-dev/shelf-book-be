import { Test, TestingModule } from '@nestjs/testing';
import { LlmProviderService } from './llm-provider.service';
import { ConfigService } from '@nestjs/config';

describe('LlmProviderService', () => {
  let service: LlmProviderService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const originalFetch = global.fetch;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LlmProviderService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<LlmProviderService>(LlmProviderService);
    configService = module.get<ConfigService>(ConfigService);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProviders', () => {
    it('should throw if no providers are configured', async () => {
      mockConfigService.get.mockReturnValue(null);
      await expect(service.streamCompletion([{ role: 'user', content: 'test' }])).rejects.toThrow(
        'No LLM providers configured',
      );
    });
  });

  describe('streamCompletion', () => {
    it('should succeed with the first provider', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'AI_CUSTOM_BASE_URL') return 'http://custom/';
        if (key === 'AI_CUSTOM_API_KEY') return 'custom-key';
        return null;
      });

      const mockResponse = { ok: true } as Response;
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const res = await service.streamCompletion([{ role: 'user', content: 'test' }]);
      expect(res).toBe(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should fall back to next provider if first fails (response not ok)', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'AI_CUSTOM_BASE_URL') return 'http://custom/';
        if (key === 'AI_CUSTOM_API_KEY') return 'custom-key';
        if (key === 'GROQ_API_KEY') return 'groq-key';
        return null;
      });

      const errorResponse = { ok: false, status: 500, text: jest.fn().mockResolvedValue('error') } as unknown as Response;
      const successResponse = { ok: true } as Response;

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(errorResponse)
        .mockResolvedValueOnce(successResponse);

      const res = await service.streamCompletion([{ role: 'user', content: 'test' }]);
      expect(res).toBe(successResponse);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should fall back to next provider if first throws an exception', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'AI_CUSTOM_BASE_URL') return 'http://custom/';
        if (key === 'AI_CUSTOM_API_KEY') return 'custom-key';
        if (key === 'GROQ_API_KEY') return 'groq-key';
        return null;
      });

      const successResponse = { ok: true } as Response;

      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(successResponse);

      const res = await service.streamCompletion([{ role: 'user', content: 'test' }]);
      expect(res).toBe(successResponse);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should try all configured providers (custom, groq, gemini)', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'AI_CUSTOM_BASE_URL') return 'http://custom/';
        if (key === 'AI_CUSTOM_API_KEY') return 'custom-key';
        if (key === 'GROQ_API_KEY') return 'groq-key';
        if (key === 'GEMINI_API_KEY') return 'gemini-key';
        return null;
      });

      const errorResponse1 = { ok: false, status: 500, text: jest.fn().mockResolvedValue('err1') } as unknown as Response;
      const errorResponse2 = { ok: false, status: 500, text: jest.fn().mockResolvedValue('err2') } as unknown as Response;
      const successResponse = { ok: true } as Response;

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(errorResponse1)
        .mockResolvedValueOnce(errorResponse2)
        .mockResolvedValueOnce(successResponse);

      const res = await service.streamCompletion([{ role: 'user', content: 'test' }]);
      expect(res).toBe(successResponse);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should throw if all providers fail', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'AI_CUSTOM_BASE_URL') return 'http://custom/';
        if (key === 'AI_CUSTOM_API_KEY') return 'custom-key';
        return null;
      });

      (global.fetch as jest.Mock).mockRejectedValue(new Error('Fail'));

      await expect(service.streamCompletion([{ role: 'user', content: 'test' }])).rejects.toThrow(
        'All LLM providers failed',
      );
    });
  });
});
