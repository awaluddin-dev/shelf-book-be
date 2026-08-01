import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { LlmProviderService } from './providers/llm-provider.service';
import { CoverLetterController } from './cover-letter/cover-letter.controller';
import { CoverLetterService } from './cover-letter/cover-letter.service';

@Module({
  imports: [ConfigModule],
  controllers: [AiController, CoverLetterController],
  providers: [AiService, LlmProviderService, CoverLetterService],
  exports: [AiService, CoverLetterService], // export if Fase 2/3 needs it
})
export class AiModule {}
