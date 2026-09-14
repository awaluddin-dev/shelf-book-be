import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';

import { HeroController } from './hero/hero.controller';
import { HeroService } from './hero/hero.service';
import { ExperienceController } from './experience/experience.controller';
import { ExperienceService } from './experience/experience.service';
import { SkillsController } from './skills/skills.controller';
import { SkillsService } from './skills/skills.service';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { ResumeController } from './resume/resume.controller';
import { ResumeService } from './resume/resume.service';

@Module({
  imports: [CommonModule],
  controllers: [
    HeroController,
    ExperienceController,
    SkillsController,
    ProjectsController,
    ResumeController,
  ],
  providers: [
    HeroService,
    ExperienceService,
    SkillsService,
    ProjectsService,
    ResumeService,
  ],
})
export class PortfolioModule {}
