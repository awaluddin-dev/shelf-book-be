import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { TopUpDto } from './top-up.dto';
import { TopUpService } from './top-up.service';

@ApiTags('Transaction')
@Controller('transaction')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class TopUpController {
  constructor(private readonly topUpService: TopUpService) {}

  @Post('topup')
  @ApiOperation({ summary: 'Top up saldo' })
  async topUp(@GetUser('id') userId: string, @Body() dto: TopUpDto) {
    return this.topUpService.execute(userId, dto);
  }
}
