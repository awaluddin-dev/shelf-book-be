import { Module } from '@nestjs/common';
import { TopUpController } from './top-up/top-up.controller';
import { TransferController } from './transfer/transfer.controller';
import { GetHistoryController } from './get-history/get-history.controller';
import { TransferService } from './transfer/transfer.service';
import { TopUpService } from './top-up/top-up.service';
import { GetHistoryService } from './get-history/get-history.service';

@Module({
  controllers: [TopUpController, TransferController, GetHistoryController],
  providers: [TransferService, TopUpService, GetHistoryService],
})
export class TransactionModule {}
