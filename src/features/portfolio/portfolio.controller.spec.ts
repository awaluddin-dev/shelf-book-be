import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { RateLimitService } from 'src/common/services/rate-limit.service';
import { FastifyRequest, FastifyReply } from 'fastify';

describe('PortfolioController', () => {
  let controller: PortfolioController;
  let portfolioService: PortfolioService;
  let rateLimitService: RateLimitService;

  const mockPortfolioService = {
    getStatus: jest.fn().mockResolvedValue('available'),
    updateStatus: jest.fn().mockResolvedValue({ success: true, status: 'busy' }),
    getHero: jest.fn().mockResolvedValue({ heroConfig: {}, metrics: [] }),
    updateHero: jest.fn().mockResolvedValue({ success: true }),
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
    getProficiencies: jest.fn().mockResolvedValue([]),
    createProficiency: jest.fn().mockResolvedValue({ id: '1' }),
    updateProficiency: jest.fn().mockResolvedValue({ id: '1' }),
    deleteProficiency: jest.fn().mockResolvedValue({ success: true }),
    getSkills: jest.fn().mockResolvedValue([]),
    createSkill: jest.fn().mockResolvedValue({ id: '1' }),
    updateSkill: jest.fn().mockResolvedValue({ id: '1' }),
    deleteSkill: jest.fn().mockResolvedValue({ success: true }),
    getRoadmaps: jest.fn().mockResolvedValue([]),
    createRoadmap: jest.fn().mockResolvedValue({ id: '1' }),
    updateRoadmap: jest.fn().mockResolvedValue({ id: '1' }),
    deleteRoadmap: jest.fn().mockResolvedValue({ success: true }),
    getProjects: jest.fn().mockResolvedValue([]),
    createProject: jest.fn().mockResolvedValue({ id: '1' }),
    updateProject: jest.fn().mockResolvedValue({ id: '1' }),
    deleteProject: jest.fn().mockResolvedValue({ success: true }),
    getSystemArchitectures: jest.fn().mockResolvedValue([]),
    createSystemArchitecture: jest.fn().mockResolvedValue({ id: '1' }),
    updateSystemArchitecture: jest.fn().mockResolvedValue({ id: '1' }),
    deleteSystemArchitecture: jest.fn().mockResolvedValue({ success: true }),
    getProjectLifecycles: jest.fn().mockResolvedValue([]),
    createProjectLifecycle: jest.fn().mockResolvedValue({ id: '1' }),
    updateProjectLifecycle: jest.fn().mockResolvedValue({ id: '1' }),
    deleteProjectLifecycle: jest.fn().mockResolvedValue({ success: true }),
  };

  const mockRateLimitService = {
    checkLimit: jest.fn().mockResolvedValue(true),
    setLimit: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortfolioController],
      providers: [
        { provide: PortfolioService, useValue: mockPortfolioService },
        { provide: RateLimitService, useValue: mockRateLimitService },
      ],
    }).compile();

    controller = module.get<PortfolioController>(PortfolioController);
    portfolioService = module.get<PortfolioService>(PortfolioService);
    rateLimitService = module.get<RateLimitService>(RateLimitService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return status', async () => {
    const res = await controller.getStatus();
    expect(res).toEqual({ status: 'available' });
    expect(portfolioService.getStatus).toHaveBeenCalled();
  });

  it('should update status', async () => {
    const res = await controller.updateStatus({ status: 'busy' } as any);
    expect(res).toEqual({ success: true, status: 'busy' });
    expect(portfolioService.updateStatus).toHaveBeenCalledWith('busy');
  });

  it('should get hero', async () => {
    const res = await controller.getHero();
    expect(res).toEqual({ heroConfig: {}, metrics: [] });
    expect(portfolioService.getHero).toHaveBeenCalled();
  });

  it('should update hero', async () => {
    const res = await controller.updateHero({ heroConfig: {}, metrics: [] });
    expect(res).toEqual({ success: true });
    expect(portfolioService.updateHero).toHaveBeenCalledWith({}, []);
  });

  it('should get testimonials', async () => {
    const res = await controller.getTestimonials();
    expect(res).toEqual([]);
    expect(portfolioService.getTestimonials).toHaveBeenCalled();
  });

  it('should create testimonial with rate limit', async () => {
    const req = {} as FastifyRequest;
    const resObj = {} as FastifyReply;
    const body = { name: 'Test' } as any;
    const res = await controller.createTestimonial(req, resObj, body);
    expect(res).toEqual({ id: '1' });
    expect(rateLimitService.checkLimit).toHaveBeenCalledWith(req);
    expect(portfolioService.createTestimonial).toHaveBeenCalledWith(body);
    expect(rateLimitService.setLimit).toHaveBeenCalledWith(req, resObj);
  });

  it('should update testimonial', async () => {
    const res = await controller.updateTestimonial('1', {});
    expect(res).toEqual({ id: '1' });
    expect(portfolioService.updateTestimonial).toHaveBeenCalledWith('1', {});
  });

  it('should delete testimonial', async () => {
    const res = await controller.deleteTestimonial('1');
    expect(res).toEqual({ success: true });
    expect(portfolioService.deleteTestimonial).toHaveBeenCalledWith('1');
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

  it('should get proficiency', async () => {
    expect(await controller.getProficiency()).toEqual([]);
  });

  it('should create proficiency', async () => {
    expect(await controller.createProficiency({} as any)).toEqual({ id: '1' });
  });

  it('should update proficiency', async () => {
    expect(await controller.updateProficiency('1', {})).toEqual({ id: '1' });
  });

  it('should delete proficiency', async () => {
    expect(await controller.deleteProficiency('1')).toEqual({ success: true });
  });

  it('should get skills', async () => {
    expect(await controller.getSkills()).toEqual([]);
  });

  it('should create skill', async () => {
    expect(await controller.createSkill({} as any)).toEqual({ id: '1' });
  });

  it('should update skill', async () => {
    expect(await controller.updateSkill('1', {})).toEqual({ id: '1' });
  });

  it('should delete skill', async () => {
    expect(await controller.deleteSkill('1')).toEqual({ success: true });
  });

  it('should get learning', async () => {
    expect(await controller.getLearning()).toEqual({ roadmap: [] });
  });

  it('should create learning', async () => {
    expect(await controller.createLearning({} as any)).toEqual({ id: '1' });
  });

  it('should update learning', async () => {
    expect(await controller.updateLearning('1', {})).toEqual({ id: '1' });
  });

  it('should delete learning', async () => {
    expect(await controller.deleteLearning('1')).toEqual({ success: true });
  });

  it('should get projects', async () => {
    expect(await controller.getProjects()).toEqual([]);
  });

  it('should create project', async () => {
    expect(await controller.createProject({} as any)).toEqual({ id: '1' });
  });

  it('should update project', async () => {
    expect(await controller.updateProject('1', {})).toEqual({ id: '1' });
  });

  it('should delete project', async () => {
    expect(await controller.deleteProject('1')).toEqual({ success: true });
  });

  it('should get architecture', async () => {
    expect(await controller.getArchitecture()).toEqual([]);
  });

  it('should create architecture', async () => {
    expect(await controller.createArchitecture({} as any)).toEqual({ id: '1' });
  });

  it('should update architecture', async () => {
    expect(await controller.updateArchitecture('1', {})).toEqual({ id: '1' });
  });

  it('should delete architecture', async () => {
    expect(await controller.deleteArchitecture('1')).toEqual({ success: true });
  });

  it('should get lifecycle', async () => {
    expect(await controller.getLifecycle()).toEqual([]);
  });

  it('should create lifecycle', async () => {
    expect(await controller.createLifecycle({} as any)).toEqual({ id: '1' });
  });

  it('should update lifecycle', async () => {
    expect(await controller.updateLifecycle('1', {})).toEqual({ id: '1' });
  });

  it('should delete lifecycle', async () => {
    expect(await controller.deleteLifecycle('1')).toEqual({ success: true });
  });
});
