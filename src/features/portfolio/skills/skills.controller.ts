import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { ProficiencyDto, SkillDto, RoadmapDto } from './skills.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Skills')
@Controller()
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  // PROFICIENCY
  @Get('proficiency')
  async getProficiency() {
    return await this.skillsService.getProficiencies();
  }

  @UseGuards(JwtGuard)
  @Post('proficiency')
  async createProficiency(@Body() body: ProficiencyDto) {
    return await this.skillsService.createProficiency(body);
  }

  @UseGuards(JwtGuard)
  @Patch('proficiency/:id')
  async updateProficiency(
    @Param('id') id: string,
    @Body() body: Partial<ProficiencyDto>,
  ) {
    return await this.skillsService.updateProficiency(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('proficiency/:id')
  async deleteProficiency(@Param('id') id: string) {
    return await this.skillsService.deleteProficiency(id);
  }

  // SKILLS
  @Get('skills')
  async getSkills() {
    return await this.skillsService.getSkills();
  }

  @UseGuards(JwtGuard)
  @Post('skills')
  async createSkill(@Body() body: SkillDto) {
    return await this.skillsService.createSkill(body);
  }

  @UseGuards(JwtGuard)
  @Patch('skills/:id')
  async updateSkill(@Param('id') id: string, @Body() body: Partial<SkillDto>) {
    return await this.skillsService.updateSkill(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('skills/:id')
  async deleteSkill(@Param('id') id: string) {
    return await this.skillsService.deleteSkill(id);
  }

  // LEARNING (roadmap)
  @Get('learning')
  async getLearning() {
    const roadmap = await this.skillsService.getRoadmaps();
    return { roadmap };
  }

  @UseGuards(JwtGuard)
  @Post('learning')
  async createLearning(@Body() body: RoadmapDto) {
    return await this.skillsService.createRoadmap(body);
  }

  @UseGuards(JwtGuard)
  @Patch('learning/:id')
  async updateLearning(
    @Param('id') id: string,
    @Body() body: Partial<RoadmapDto>,
  ) {
    return await this.skillsService.updateRoadmap(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('learning/:id')
  async deleteLearning(@Param('id') id: string) {
    return await this.skillsService.deleteRoadmap(id);
  }
}
