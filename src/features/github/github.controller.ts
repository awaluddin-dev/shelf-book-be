import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GithubService } from './github.service';
import { GithubContributionResponseDto } from './github.dto';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@ApiTags('Github')
@ApiGlobalResponses()
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('contributions/:username')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('cache_contributions')
  @ApiOperation({ summary: 'Get GitHub heatmap contributions for a user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved GitHub contributions',
    type: GithubContributionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to fetch GitHub contributions',
    schema: {
      example: {
        statusCode: 400,
        message: ['Validation failed'],
        error: 'Bad Request',
      },
    },
  })
  async getContributions(@Param('username') username: string) {
    return this.githubService.getContributions(username);
  }
}
