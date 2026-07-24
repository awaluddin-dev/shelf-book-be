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
    await expect(service.getContributions('testuser')).rejects.toThrow(
      HttpException,
    );
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

  it('should parse complex github contributions response correctly', async () => {
    process.env.GITHUB_TOKEN = 'mock-token';
    const mockResponse = {
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: 100,
              weeks: [
                {
                  contributionDays: [
                    { contributionCount: 5, date: '2023-01-01T00:00:00Z', weekday: 0, contributionLevel: 'FOURTH_QUARTILE' },
                    { contributionCount: 0, date: '2023-01-02T00:00:00Z', weekday: 1, contributionLevel: 'NONE' }
                  ],
                },
                {
                  contributionDays: [
                    { contributionCount: 2, date: '2023-01-08T00:00:00Z', weekday: 0, contributionLevel: 'SECOND_QUARTILE' }
                  ]
                }
              ],
            },
            commitContributionsByRepository: [
              { repository: { name: 'repo-A' }, contributions: { totalCount: 10 } },
              { repository: { name: 'repo-B' }, contributions: { totalCount: 20 } },
            ],
            pullRequestContributionsByRepository: [
              { repository: { name: 'repo-A' }, contributions: { totalCount: 5 } },
              { repository: { name: 'repo-C' }, contributions: { totalCount: 15 } },
            ],
          },
          repositories: {
            nodes: [
              {
                languages: {
                  edges: [
                    { size: 100, node: { name: 'TypeScript', color: '#2b7489' } },
                    { size: 50, node: { name: 'JavaScript', color: '#f1e05a' } },
                    { size: 10, node: { name: 'HTML', color: '#e34c26' } },
                    { size: 10, node: { name: 'CSS', color: '#563d7c' } },
                    { size: 10, node: { name: 'Python', color: '#3572A5' } },
                    { size: 10, node: { name: 'Go', color: '#00ADD8' } },
                    { size: 10, node: { name: 'Rust', color: '#dea584' } },
                    { size: 5, node: { name: 'C++', color: '#f34b7d' } },
                  ]
                }
              }
            ],
          },
        },
      },
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await service.getContributions('testuser');

    expect(result.calendar.length).toBe(2);
    // test others in languages (since we have 8, 6 top and 1 "Others")
    expect(result.languages.length).toBe(7);
    const others = result.languages.find(l => l.name === 'Others');
    expect(others).toBeDefined();

    // repos sorted by commits + pull requests
    // repo-B (20 + 0 = 20)
    // repo-A (10 + 5 = 15)
    // repo-C (0 + 15 = 15)
    expect(result.repositories[0].name).toBe('repo-B');
    expect(result.repositories[1].name).toBe('repo-A');
    expect(result.repositories[2].name).toBe('repo-C');
  });

  it('should return empty structures if calendar is missing', async () => {
    process.env.GITHUB_TOKEN = 'mock-token';
    const mockResponse = { data: { user: { contributionsCollection: null } } };
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });
    
    const result = await service.getContributions('testuser');
    expect(result).toEqual({ calendar: [], timeline: [], repositories: [] });
  });

  it('should handle API errors returned in json correctly', async () => {
    process.env.GITHUB_TOKEN = 'mock-token';
    const mockResponse = {
      errors: [{ message: 'User not found' }],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    await expect(service.getContributions('unknown_user')).rejects.toThrow(
      HttpException,
    );
  });
});
