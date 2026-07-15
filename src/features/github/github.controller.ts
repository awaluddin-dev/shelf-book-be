import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GithubService } from './github.service';

@ApiTags('Github')
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('contributions/:username')
  @ApiOperation({ summary: 'Get GitHub heatmap contributions for a user' })
  async getContributions(@Param('username') username: string) {
    return this.githubService.getContributions(username);
  }
}
