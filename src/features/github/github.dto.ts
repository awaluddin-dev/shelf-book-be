import { ApiProperty } from '@nestjs/swagger';

export class GithubContributionResponseDto {
  @ApiProperty({ description: 'GitHub contributions data', example: { total: 1000 } })
  data: any;
}
