import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let projectsService: ProjectsService;

  const mockProjectsService = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [{ provide: ProjectsService, useValue: mockProjectsService }],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
