import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { HttpException } from '@nestjs/common';

describe('GithubService', () => {
  let service: GithubService;
  const originalEnv = process.env;

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...originalEnv };
    const module: TestingModule = await Test.createTestingModule({
      providers: [GithubService],
    }).compile();

    service = module.get<GithubService>(GithubService);
    
    // Mock global fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if GITHUB_TOKEN is missing', async () => {
    delete process.env.GITHUB_TOKEN;
    await expect(service.getContributions('testuser')).rejects.toThrow(HttpException);
  });

  it('should return parsed github contributions successfully', async () => {
    process.env.GITHUB_TOKEN = 'mock-token';
    const mockResponse = {
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: 5,
              weeks: [
                {
                  contributionDays: [
                    {
                      contributionCount: 5,
                      date: '2023-10-10T00:00:00Z',
                      weekday: 2,
                      contributionLevel: 'FIRST_QUARTILE',
                    },
                  ],
                },
              ],
            },
            commitContributionsByRepository: [],
            pullRequestContributionsByRepository: [],
          },
          repositories: {
            nodes: [],
          },
        },
      },
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await service.getContributions('testuser');
    
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result).toHaveProperty('calendar');
    expect(result).toHaveProperty('timeline');
    expect(result).toHaveProperty('repositories');
    expect(result).toHaveProperty('languages');
    
    // Check if the single day is processed
    expect(result.calendar[0][2]).toHaveProperty('count', 5);
  });

  it('should handle API errors returned in json correctly', async () => {
    process.env.GITHUB_TOKEN = 'mock-token';
    const mockResponse = {
      errors: [{ message: 'User not found' }]
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    await expect(service.getContributions('unknown_user')).rejects.toThrow(HttpException);
  });
});
