import { Test, TestingModule } from '@nestjs/testing';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';

describe('SkillsController', () => {
  let controller: SkillsController;
  let skillsService: SkillsService;

  const mockSkillsService = {
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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsController],
      providers: [{ provide: SkillsService, useValue: mockSkillsService }],
    }).compile();

    controller = module.get<SkillsController>(SkillsController);
    skillsService = module.get<SkillsService>(SkillsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
});
