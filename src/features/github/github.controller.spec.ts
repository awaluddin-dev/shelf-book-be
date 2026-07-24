import { Test, TestingModule } from '@nestjs/testing';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

describe('GithubController', () => {
  let controller: GithubController;

  beforeEach(async () => {
    const mockGithubService = {
      getContributions: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GithubController],
      providers: [
        {
          provide: GithubService,
          useValue: mockGithubService,
        },
      ],
    }).compile();

    controller = module.get<GithubController>(GithubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get contributions', async () => {
    const mockData = { calendar: [] };
    const githubService = controller['githubService'];
    (githubService.getContributions as jest.Mock).mockResolvedValue(mockData);
    
    const result = await controller.getContributions('testuser');
    expect(result).toEqual(mockData);
    expect(githubService.getContributions).toHaveBeenCalledWith('testuser');
  });
});
