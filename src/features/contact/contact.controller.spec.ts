import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { RateLimitService } from 'src/common/services/rate-limit.service';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { CreateInquiryDto } from './contact.dto';

describe('ContactController', () => {
  let controller: ContactController;
  let contactService: ContactService;
  let rateLimitService: RateLimitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        {
          provide: ContactService,
          useValue: {
            sendInquiry: jest.fn(),
          },
        },
        {
          provide: RateLimitService,
          useValue: {
            checkLimit: jest.fn(),
            setLimit: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ContactController>(ContactController);
    contactService = module.get<ContactService>(ContactService);
    rateLimitService = module.get<RateLimitService>(RateLimitService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendInquiry', () => {
    it('should call rateLimitService and contactService correctly', async () => {
      const mockReq = {} as FastifyRequest;
      const mockRes = {} as FastifyReply;
      const mockDto: CreateInquiryDto = {
        name: 'Test',
        email: 'test@example.com',
        projectType: 'Web',
        message: 'Hello',
      };

      const mockResult = {
        success: true,
        message: 'Inquiry sent successfully',
        id: '123',
      };

      jest.spyOn(rateLimitService, 'checkLimit').mockResolvedValue(undefined);
      jest.spyOn(contactService, 'sendInquiry').mockResolvedValue(mockResult);
      jest.spyOn(rateLimitService, 'setLimit').mockResolvedValue(undefined);

      const result = await controller.sendInquiry(mockReq, mockRes, mockDto);

      expect(rateLimitService.checkLimit).toHaveBeenCalledWith(mockReq);
      expect(contactService.sendInquiry).toHaveBeenCalledWith(mockDto);
      expect(rateLimitService.setLimit).toHaveBeenCalledWith(mockReq, mockRes);
      expect(result).toEqual(mockResult);
    });
  });
});
