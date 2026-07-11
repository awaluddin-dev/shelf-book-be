import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { TransferDto } from './transfer.dto';
import { TransferService } from './transfer.service';

@ApiTags('Transaction')
@Controller('transaction')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer saldo' })
  async transfer(@GetUser('id') senderId: string, @Body() dto: TransferDto) {
    return this.transferService.execute(senderId, dto);
  }
}
