import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

export interface GithubCalendarDay {
  date: string;
  count: number;
  level: number;
  dayOfWeek?: number;
  month?: number;
}

interface GithubResponse {
  errors?: { message: string }[];
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: {
            contributionDays: {
              contributionCount: number;
              date: string;
              weekday: number;
              contributionLevel: string;
            }[];
          }[];
        };
        commitContributionsByRepository?: {
          repository: { name: string };
          contributions: { totalCount: number };
        }[];
        pullRequestContributionsByRepository?: {
          repository: { name: string };
          contributions: { totalCount: number };
        }[];
      };
      repositories?: {
        nodes?: {
          languages?: {
            edges?: {
              size: number;
              node: { name: string; color: string };
            }[];
          };
        }[];
      };
    };
  };
}

@Injectable()
export class GithubService {
  async getContributions(username: string) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new HttpException(
        'GitHub token is missing in environment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const query = `
      query {
        user(login: "${username}") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  weekday
                  contributionLevel
                }
              }
            }
            commitContributionsByRepository(maxRepositories: 10) {
              repository {
                name
              }
              contributions {
                totalCount
              }
            }
            pullRequestContributionsByRepository(maxRepositories: 10) {
              repository {
                name
              }
              contributions {
                totalCount
              }
            }
          }
          repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
            nodes {
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const json = (await res.json()) as GithubResponse;

      if (json.errors) {
        throw new Error(json.errors[0].message);
      }

      const contributionsCollection = json.data?.user?.contributionsCollection;
      const calendar = contributionsCollection?.contributionCalendar;

      if (!calendar) {
        return { calendar: [], timeline: [], repositories: [] };
      }

      const levelMap = {
        NONE: 0,
        FIRST_QUARTILE: 1,
        SECOND_QUARTILE: 2,
        THIRD_QUARTILE: 3,
        FOURTH_QUARTILE: 4,
      };

      const calendarResult: (GithubCalendarDay | null)[][] = [];
      const monthlyAggregates: Record<
        string,
        { commits: number; pullRequests: number; issues: number }
      > = {};

      for (const week of calendar.weeks) {
        const weekDays: (GithubCalendarDay | null)[] = [];
        // Pad the beginning of the first week if necessary
        if (calendarResult.length === 0 && week.contributionDays.length > 0) {
          const firstDay = week.contributionDays[0].weekday;
          for (let i = 0; i < firstDay; i++) {
            weekDays.push(null);
          }
        }

        for (const day of week.contributionDays) {
          const d = new Date(day.date);
          const monthKey = d.toLocaleDateString('en-US', {
            month: 'short',
            year: '2-digit',
          });

          if (!monthlyAggregates[monthKey]) {
            monthlyAggregates[monthKey] = {
              commits: 0,
              pullRequests: 0,
              issues: 0,
            };
          }
          // We map total contributions to "commits" in the timeline (for visualization purposes)
          monthlyAggregates[monthKey].commits += day.contributionCount;

          weekDays.push({
            date: d.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            count: day.contributionCount,
            level: levelMap[day.contributionLevel] || 0,
            dayOfWeek: day.weekday,
            month: d.getMonth(),
          });
        }
        calendarResult.push(weekDays);
      }

      // Format Timeline Data
      const timelineResult = Object.entries(monthlyAggregates).map(
        ([month, data]) => ({
          month,
          commits: data.commits,
          pullRequests: 0, // Mocked to 0 or we could omit, UI expects commits
          issues: 0,
        }),
      );

      // Process Repository Data
      const repoMap: Record<string, { commits: number; pullRequests: number }> =
        {};

      const commitRepos =
        contributionsCollection?.commitContributionsByRepository || [];
      for (const repo of commitRepos) {
        const name = repo.repository.name;
        if (!repoMap[name]) repoMap[name] = { commits: 0, pullRequests: 0 };
        repoMap[name].commits += repo.contributions.totalCount;
      }

      const prRepos =
        contributionsCollection?.pullRequestContributionsByRepository || [];
      for (const repo of prRepos) {
        const name = repo.repository.name;
        if (!repoMap[name]) repoMap[name] = { commits: 0, pullRequests: 0 };
        repoMap[name].pullRequests += repo.contributions.totalCount;
      }

      const repoResult = Object.entries(repoMap)
        .map(([name, data]) => ({
          name,
          commits: data.commits,
          pullRequests: data.pullRequests,
        }))
        .sort(
          (a, b) => b.commits + b.pullRequests - (a.commits + a.pullRequests),
        )
        .slice(0, 5); // Limit to top 5 repos

      // Process Languages Data
      const langMap: Record<string, { size: number; color: string }> = {};
      let totalSize = 0;

      const repos = json.data?.user?.repositories?.nodes || [];
      for (const repo of repos) {
        const edges = repo.languages?.edges || [];
        for (const edge of edges) {
          const name = edge.node.name;
          const color = edge.node.color || '#cccccc';
          const size = edge.size;

          if (!langMap[name]) {
            langMap[name] = { size: 0, color };
          }
          langMap[name].size += size;
          totalSize += size;
        }
      }

      let langResult = Object.entries(langMap)
        .map(([name, data]) => ({
          name,
          color: data.color,
          size: data.size,
          percentage: totalSize > 0 ? (data.size / totalSize) * 100 : 0,
        }))
        .sort((a, b) => b.size - a.size);

      // Keep top 6, group others
      if (langResult.length > 6) {
        const top6 = langResult.slice(0, 6);
        const others = langResult.slice(6);
        const othersSize = others.reduce((acc, curr) => acc + curr.size, 0);
        if (othersSize > 0) {
          top6.push({
            name: 'Others',
            color: '#858585',
            size: othersSize,
            percentage: (othersSize / totalSize) * 100,
          });
        }
        langResult = top6;
      }

      return {
        calendar: calendarResult,
        timeline: timelineResult,
        repositories: repoResult,
        languages: langResult,
      };
    } catch (error) {
      console.error('GitHub API Error:', error);
      throw new HttpException(
        'Failed to fetch GitHub contributions',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
