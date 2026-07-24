import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { RateLimitService } from 'src/common/services/rate-limit.service';
import { PortfolioService } from './portfolio.service';
import {
  PortfolioStatusDto,
  HeroConfigDto,
  MetricDto,
  TestimonialDto,
  WorkExperienceDto,
  CurrentFocusDto,
  ProficiencyDto,
  SkillDto,
  RoadmapDto,
  ProjectDto,
  SystemArchitectureDto,
  ProjectLifecycleDto,
} from './portfolio.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Portfolio')
@Controller()
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  // STATUS
  @Get('status')
  async getStatus() {
    return { status: await this.portfolioService.getStatus() };
  }

  @UseGuards(JwtGuard)
  @Post('status')
  async updateStatus(@Body() body: PortfolioStatusDto) {
    return await this.portfolioService.updateStatus(body.status);
  }

  // HERO
  @Get('hero')
  async getHero() {
    const data = await this.portfolioService.getHero();
    return {
      heroConfig: data.heroConfig,
      metrics: data.metrics,
    };
  }

  @UseGuards(JwtGuard)
  @Patch('hero')
  async updateHero(
    @Body()
    body: {
      heroConfig?: Partial<HeroConfigDto>;
      metrics?: MetricDto[];
    },
  ) {
    return await this.portfolioService.updateHero(
      body.heroConfig,
      body.metrics,
    );
  }

  // TESTIMONIALS (rate-limited for public submission)
  @Get('testimonials')
  async getTestimonials() {
    return await this.portfolioService.getTestimonials();
  }

  @Post('testimonials')
  async createTestimonial(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() body: TestimonialDto,
  ) {
    await this.rateLimitService.checkLimit(req);
    const result = await this.portfolioService.createTestimonial(body);
    await this.rateLimitService.setLimit(req, res);
    return result;
  }

  @UseGuards(JwtGuard)
  @Patch('testimonials/:id')
  async updateTestimonial(
    @Param('id') id: string,
    @Body() body: Partial<TestimonialDto>,
  ) {
    return await this.portfolioService.updateTestimonial(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('testimonials/:id')
  async deleteTestimonial(@Param('id') id: string) {
    return await this.portfolioService.deleteTestimonial(id);
  }

  // WORK (workExperience)
  @Get('work')
  async getWork() {
    return await this.portfolioService.getWorkExperiences();
  }

  @UseGuards(JwtGuard)
  @Post('work')
  async createWork(@Body() body: WorkExperienceDto) {
    return await this.portfolioService.createWorkExperience(body);
  }

  @UseGuards(JwtGuard)
  @Patch('work/:id')
  async updateWork(
    @Param('id') id: string,
    @Body() body: Partial<WorkExperienceDto>,
  ) {
    return await this.portfolioService.updateWorkExperience(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('work/:id')
  async deleteWork(@Param('id') id: string) {
    return await this.portfolioService.deleteWorkExperience(id);
  }

  // CURRENT (currentFocus)
  @Get('current')
  async getCurrent() {
    return await this.portfolioService.getCurrentFoci();
  }

  @UseGuards(JwtGuard)
  @Post('current')
  async createCurrent(@Body() body: CurrentFocusDto) {
    return await this.portfolioService.createCurrentFocus(body);
  }

  @UseGuards(JwtGuard)
  @Patch('current/:id')
  async updateCurrent(
    @Param('id') id: string,
    @Body() body: Partial<CurrentFocusDto>,
  ) {
    return await this.portfolioService.updateCurrentFocus(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('current/:id')
  async deleteCurrent(@Param('id') id: string) {
    return await this.portfolioService.deleteCurrentFocus(id);
  }

  // PROFICIENCY
  @Get('proficiency')
  async getProficiency() {
    return await this.portfolioService.getProficiencies();
  }

  @UseGuards(JwtGuard)
  @Post('proficiency')
  async createProficiency(@Body() body: ProficiencyDto) {
    return await this.portfolioService.createProficiency(body);
  }

  @UseGuards(JwtGuard)
  @Patch('proficiency/:id')
  async updateProficiency(
    @Param('id') id: string,
    @Body() body: Partial<ProficiencyDto>,
  ) {
    return await this.portfolioService.updateProficiency(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('proficiency/:id')
  async deleteProficiency(@Param('id') id: string) {
    return await this.portfolioService.deleteProficiency(id);
  }

  // SKILLS
  @Get('skills')
  async getSkills() {
    return await this.portfolioService.getSkills();
  }

  @UseGuards(JwtGuard)
  @Post('skills')
  async createSkill(@Body() body: SkillDto) {
    return await this.portfolioService.createSkill(body);
  }

  @UseGuards(JwtGuard)
  @Patch('skills/:id')
  async updateSkill(@Param('id') id: string, @Body() body: Partial<SkillDto>) {
    return await this.portfolioService.updateSkill(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('skills/:id')
  async deleteSkill(@Param('id') id: string) {
    return await this.portfolioService.deleteSkill(id);
  }

  // LEARNING (roadmap)
  @Get('learning')
  async getLearning() {
    const roadmap = await this.portfolioService.getRoadmaps();
    return { roadmap };
  }

  @UseGuards(JwtGuard)
  @Post('learning')
  async createLearning(@Body() body: RoadmapDto) {
    return await this.portfolioService.createRoadmap(body);
  }

  @UseGuards(JwtGuard)
  @Patch('learning/:id')
  async updateLearning(
    @Param('id') id: string,
    @Body() body: Partial<RoadmapDto>,
  ) {
    return await this.portfolioService.updateRoadmap(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('learning/:id')
  async deleteLearning(@Param('id') id: string) {
    return await this.portfolioService.deleteRoadmap(id);
  }

  // PROJECTS
  @Get('projects')
  async getProjects() {
    return await this.portfolioService.getProjects();
  }

  @UseGuards(JwtGuard)
  @Post('projects')
  async createProject(@Body() body: ProjectDto) {
    return await this.portfolioService.createProject(body);
  }

  @UseGuards(JwtGuard)
  @Patch('projects/:id')
  async updateProject(
    @Param('id') id: string,
    @Body() body: Partial<ProjectDto>,
  ) {
    return await this.portfolioService.updateProject(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('projects/:id')
  async deleteProject(@Param('id') id: string) {
    return await this.portfolioService.deleteProject(id);
  }

  // SYSTEM ARCHITECTURE
  @Get('architecture')
  async getArchitecture() {
    return await this.portfolioService.getSystemArchitectures();
  }

  @UseGuards(JwtGuard)
  @Post('architecture')
  async createArchitecture(@Body() body: SystemArchitectureDto) {
    return await this.portfolioService.createSystemArchitecture(body);
  }

  @UseGuards(JwtGuard)
  @Patch('architecture/:id')
  async updateArchitecture(
    @Param('id') id: string,
    @Body() body: Partial<SystemArchitectureDto>,
  ) {
    return await this.portfolioService.updateSystemArchitecture(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('architecture/:id')
  async deleteArchitecture(@Param('id') id: string) {
    return await this.portfolioService.deleteSystemArchitecture(id);
  }

  // PROJECT LIFECYCLE
  @Get('lifecycle')
  async getLifecycle() {
    return await this.portfolioService.getProjectLifecycles();
  }

  @UseGuards(JwtGuard)
  @Post('lifecycle')
  async createLifecycle(@Body() body: ProjectLifecycleDto) {
    return await this.portfolioService.createProjectLifecycle(body);
  }

  @UseGuards(JwtGuard)
  @Patch('lifecycle/:id')
  async updateLifecycle(
    @Param('id') id: string,
    @Body() body: Partial<ProjectLifecycleDto>,
  ) {
    return await this.portfolioService.updateProjectLifecycle(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('lifecycle/:id')
  async deleteLifecycle(@Param('id') id: string) {
    return await this.portfolioService.deleteProjectLifecycle(id);
  }
}
