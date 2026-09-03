import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn(),
      },
    })),
  };
});

describe('ContactService', () => {
  let service: ContactService;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(async () => {
    originalEnv = process.env;
    process.env = { ...originalEnv, RESEND_API_KEY: 'test-api-key' };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactService],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendInquiry', () => {
    it('should throw an error if RESEND_API_KEY is not set', async () => {
      delete process.env.RESEND_API_KEY;
      await expect(
        service.sendInquiry({
          name: 'Test',
          email: 'test@example.com',
          projectType: 'Web',
          message: 'Hello',
        }),
      ).rejects.toThrow(
        new HttpException(
          'Resend API key is missing',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });

    it('should send email successfully', async () => {
      const mockData = { id: 'test-id' };
      (service['resend'].emails.send as jest.Mock).mockResolvedValue({
        data: mockData,
        error: null,
      });

      const dto = {
        name: 'Test',
        email: 'test@example.com',
        projectType: 'Web',
        message: 'Hello\nWorld',
      };
      const result = await service.sendInquiry(dto);

      expect(service['resend'].emails.send).toHaveBeenCalledWith({
        from: 'Portfolio Inquiry <onboarding@resend.dev>',
        to: 'hello@awaluddin.dev',
        replyTo: 'test@example.com',
        subject: 'New Inquiry from Test - Web',
        html: expect.stringContaining('Hello<br/>World'),
      });
      expect(result).toEqual({
        success: true,
        message: 'Inquiry sent successfully',
        id: 'test-id',
      });
    });

    it('should handle resend API error', async () => {
      const mockError = { message: 'API Error' };
      (service['resend'].emails.send as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(
        service.sendInquiry({
          name: 'Test',
          email: 'test@example.com',
          projectType: 'Web',
          message: 'Hello',
        }),
      ).rejects.toThrow(
        new HttpException(
          'Failed to send email',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Email send error:',
        expect.any(HttpException),
      );
      consoleErrorSpy.mockRestore();
    });

    it('should handle unexpected exception', async () => {
      const unexpectedError = new Error('Unexpected');
      (service['resend'].emails.send as jest.Mock).mockRejectedValue(
        unexpectedError,
      );

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(
        service.sendInquiry({
          name: 'Test',
          email: 'test@example.com',
          projectType: 'Web',
          message: 'Hello',
        }),
      ).rejects.toThrow(
        new HttpException(
          'Failed to send email',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Email send error:',
        unexpectedError,
      );
      consoleErrorSpy.mockRestore();
    });
  });
});
