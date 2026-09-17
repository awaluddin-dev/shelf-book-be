import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HeroV2Controller } from './hero/hero-v2.controller';
import { HeroV2Service } from './hero/hero-v2.service';
import { ExperienceV2Controller } from './experience/experience-v2.controller';
import { ExperienceV2Service } from './experience/experience-v2.service';
import { ProficiencyV2Controller } from './proficiency/proficiency-v2.controller';
import { ProficiencyV2Service } from './proficiency/proficiency-v2.service';
import { ProjectsV2Controller } from './projects/projects-v2.controller';
import { ProjectsV2Service } from './projects/projects-v2.service';

@Module({
  imports: [CommonModule, PrismaModule],
  controllers: [
    HeroV2Controller,
    ExperienceV2Controller,
    ProficiencyV2Controller,
    ProjectsV2Controller,
  ],
  providers: [
    HeroV2Service,
    ExperienceV2Service,
    ProficiencyV2Service,
    ProjectsV2Service,
  ],
  exports: [
    HeroV2Service,
    ExperienceV2Service,
    ProficiencyV2Service,
    ProjectsV2Service,
  ],
})
export class PortfolioV2Module {}
