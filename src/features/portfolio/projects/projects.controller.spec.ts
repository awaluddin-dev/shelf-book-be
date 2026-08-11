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
    getTechnicalImageries: jest.fn().mockResolvedValue([]),
    upsertTechnicalImagery: jest.fn().mockResolvedValue({ id: '1' }),
    updateTechnicalImagery: jest.fn().mockResolvedValue({ id: '1' }),
    deleteTechnicalImagery: jest.fn().mockResolvedValue({ success: true }),
    getProjectDatabaseSchemas: jest.fn().mockResolvedValue([]),
    createProjectDatabaseSchema: jest.fn().mockResolvedValue({ id: '1' }),
    updateProjectDatabaseSchema: jest.fn().mockResolvedValue({ id: '1' }),
    deleteProjectDatabaseSchema: jest.fn().mockResolvedValue({ success: true }),
    getProjectErds: jest.fn().mockResolvedValue([]),
    createProjectErd: jest.fn().mockResolvedValue({ id: '1' }),
    updateProjectErd: jest.fn().mockResolvedValue({ id: '1' }),
    deleteProjectErd: jest.fn().mockResolvedValue({ success: true }),
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

  it('should get technical imagery list', async () => {
    expect(await controller.getTechnicalImageryList()).toEqual([]);
  });

  it('should upsert technical imagery', async () => {
    expect(await controller.upsertTechnicalImagery({ projectId: 'p1' } as any)).toEqual({ id: '1' });
    expect(projectsService.upsertTechnicalImagery).toHaveBeenCalledWith('p1', {});
  });

  it('should update technical imagery', async () => {
    expect(await controller.updateTechnicalImagery('1', {})).toEqual({ id: '1' });
  });

  it('should delete technical imagery', async () => {
    expect(await controller.deleteTechnicalImagery('1')).toEqual({ success: true });
  });

  it('should get database schema list', async () => {
    expect(await controller.getDatabaseSchemaList()).toEqual([]);
  });

  it('should create database schema', async () => {
    expect(await controller.createDatabaseSchema({} as any)).toEqual({ id: '1' });
  });

  it('should update database schema', async () => {
    expect(await controller.updateDatabaseSchema('1', {})).toEqual({ id: '1' });
  });

  it('should delete database schema', async () => {
    expect(await controller.deleteDatabaseSchema('1')).toEqual({ success: true });
  });

  it('should get erd list', async () => {
    expect(await controller.getErdList()).toEqual([]);
  });

  it('should create erd', async () => {
    expect(await controller.createErd({} as any)).toEqual({ id: '1' });
  });

  it('should update erd', async () => {
    expect(await controller.updateErd('1', {})).toEqual({ id: '1' });
  });

  it('should delete erd', async () => {
    expect(await controller.deleteErd('1')).toEqual({ success: true });
  });
});
