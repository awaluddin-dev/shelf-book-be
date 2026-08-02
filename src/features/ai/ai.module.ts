import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { LlmProviderService } from './providers/llm-provider.service';
import { CoverLetterController } from './cover-letter/cover-letter.controller';
import { CoverLetterService } from './cover-letter/cover-letter.service';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { RagRetrievalService } from './chat/rag-retrieval.service';

@Module({
  imports: [ConfigModule],
  controllers: [AiController, CoverLetterController, ChatController],
  providers: [
    AiService,
    LlmProviderService,
    CoverLetterService,
    ChatService,
    RagRetrievalService,
  ],
  exports: [AiService, CoverLetterService, ChatService], // export if Fase 2/3 needs it
})
export class AiModule {}
