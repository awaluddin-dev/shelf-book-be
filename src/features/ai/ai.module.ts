import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { LlmProviderService } from './providers/llm-provider.service';

@Module({
  imports: [ConfigModule],
  controllers: [AiController],
  providers: [AiService, LlmProviderService],
  exports: [AiService], // export if Fase 2/3 needs it
})
export class AiModule {}
