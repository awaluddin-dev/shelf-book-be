import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';
import { RateLimitService } from 'src/common/services/rate-limit.service';
import { FastifyRequest, FastifyReply } from 'fastify';

describe('ExperienceController', () => {
  let controller: ExperienceController;
  let experienceService: ExperienceService;
  let rateLimitService: RateLimitService;

  const mockExperienceService = {
    getTestimonials: jest.fn().mockResolvedValue([]),
    createTestimonial: jest.fn().mockResolvedValue({ id: '1' }),
    updateTestimonial: jest.fn().mockResolvedValue({ id: '1' }),
    deleteTestimonial: jest.fn().mockResolvedValue({ success: true }),
    getWorkExperiences: jest.fn().mockResolvedValue([]),
    createWorkExperience: jest.fn().mockResolvedValue({ id: '1' }),
    updateWorkExperience: jest.fn().mockResolvedValue({ id: '1' }),
    deleteWorkExperience: jest.fn().mockResolvedValue({ success: true }),
    getCurrentFoci: jest.fn().mockResolvedValue([]),
    createCurrentFocus: jest.fn().mockResolvedValue({ id: '1' }),
    updateCurrentFocus: jest.fn().mockResolvedValue({ id: '1' }),
    deleteCurrentFocus: jest.fn().mockResolvedValue({ success: true }),
  };

  const mockRateLimitService = {
    checkLimit: jest.fn().mockResolvedValue(true),
    setLimit: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperienceController],
      providers: [
        { provide: ExperienceService, useValue: mockExperienceService },
        { provide: RateLimitService, useValue: mockRateLimitService },
      ],
    }).compile();

    controller = module.get<ExperienceController>(ExperienceController);
    experienceService = module.get<ExperienceService>(ExperienceService);
    rateLimitService = module.get<RateLimitService>(RateLimitService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get testimonials', async () => {
    const res = await controller.getTestimonials();
    expect(res).toEqual([]);
    expect(experienceService.getTestimonials).toHaveBeenCalled();
  });

  it('should create testimonial with rate limit', async () => {
    const req = {} as FastifyRequest;
    const resObj = {} as FastifyReply;
    const body = { name: 'Test' } as any;
    const res = await controller.createTestimonial(req, resObj, body);
    expect(res).toEqual({ id: '1' });
    expect(rateLimitService.checkLimit).toHaveBeenCalledWith(req);
    expect(experienceService.createTestimonial).toHaveBeenCalledWith(body);
    expect(rateLimitService.setLimit).toHaveBeenCalledWith(req, resObj);
  });

  it('should update testimonial', async () => {
    const res = await controller.updateTestimonial('1', {});
    expect(res).toEqual({ id: '1' });
    expect(experienceService.updateTestimonial).toHaveBeenCalledWith('1', {});
  });

  it('should delete testimonial', async () => {
    const res = await controller.deleteTestimonial('1');
    expect(res).toEqual({ success: true });
    expect(experienceService.deleteTestimonial).toHaveBeenCalledWith('1');
  });

  it('should get work', async () => {
    expect(await controller.getWork()).toEqual([]);
  });

  it('should create work', async () => {
    expect(await controller.createWork({} as any)).toEqual({ id: '1' });
  });

  it('should update work', async () => {
    expect(await controller.updateWork('1', {})).toEqual({ id: '1' });
  });

  it('should delete work', async () => {
    expect(await controller.deleteWork('1')).toEqual({ success: true });
  });

  it('should get current', async () => {
    expect(await controller.getCurrent()).toEqual([]);
  });

  it('should create current', async () => {
    expect(await controller.createCurrent({} as any)).toEqual({ id: '1' });
  });

  it('should update current', async () => {
    expect(await controller.updateCurrent('1', {})).toEqual({ id: '1' });
  });

  it('should delete current', async () => {
    expect(await controller.deleteCurrent('1')).toEqual({ success: true });
  });
});
