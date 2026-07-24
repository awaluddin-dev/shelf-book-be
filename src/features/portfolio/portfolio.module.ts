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

@Module({
  imports: [CommonModule],
  controllers: [
    HeroController,
    ExperienceController,
    SkillsController,
    ProjectsController,
  ],
  providers: [
    HeroService,
    ExperienceService,
    SkillsService,
    ProjectsService,
  ],
})
export class PortfolioModule {}
