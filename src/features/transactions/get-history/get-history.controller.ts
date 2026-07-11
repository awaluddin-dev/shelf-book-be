import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetHistoryService } from './get-history.service';

@ApiTags('Transaction')
@Controller('transaction')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class GetHistoryController {
  constructor(private readonly getHistoryService: GetHistoryService) {}

  @Get('history')
  @ApiOperation({ summary: 'Get history' })
  async getHistory(@GetUser('id') userId: string) {
    return this.getHistoryService.execute(userId);
  }
}
