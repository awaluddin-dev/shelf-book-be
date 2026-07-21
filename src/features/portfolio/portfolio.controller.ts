import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  UseGuards,
  Headers,
  Req,
  Res,
} from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { RateLimitService } from 'src/common/services/rate-limit.service';
import { PortfolioService, GenericModelDelegate } from './portfolio.service';
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
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('Portfolio')
@Controller()
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly prisma: PrismaService,
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
  async getHero(
    @Headers('if-none-match') ifNoneMatch: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const data = await this.portfolioService.getHero();

    let latestUpdate = 0;
    const heroConfig = data.heroConfig as { updatedAt?: Date };
    if (heroConfig?.updatedAt) {
      latestUpdate = new Date(heroConfig.updatedAt).getTime();
    }
    if (data.metrics && data.metrics.length > 0) {
      const metricsDates = data.metrics.map((m: { updatedAt: Date | string }) =>
        new Date(m.updatedAt).getTime(),
      );
      const maxMetricDate = Math.max(
        ...metricsDates.filter((d: number) => !isNaN(d)),
      );
      if (maxMetricDate > latestUpdate) latestUpdate = maxMetricDate;
    }
    if (latestUpdate === 0) latestUpdate = Date.now();

    const etag = `W/"${latestUpdate}"`;

    res.header('ETag', etag);
    res.header('Cache-Control', 'public, max-age=0, must-revalidate');

    if (ifNoneMatch === etag) {
      res.status(304);
      return;
    }

    return {
      heroConfig: data.heroConfig,
      metrics: data.metrics,
      meta: {
        etag,
        lastUpdated: new Date(latestUpdate).toISOString(),
      },
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

  // TESTIMONIALS
  @Get('testimonials')
  async getTestimonials() {
    return await this.portfolioService.getArrayData(
      this.prisma.testimonial as unknown as GenericModelDelegate,
    );
  }

  @Post('testimonials')
  async createTestimonial(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() body: TestimonialDto,
  ) {
    await this.rateLimitService.checkLimit(req);
    const result = await this.portfolioService.createArrayItem(
      this.prisma.testimonial as unknown as GenericModelDelegate,
      body,
    );
    await this.rateLimitService.setLimit(req, res);
    return result;
  }

  @UseGuards(JwtGuard)
  @Patch('testimonials/:id')
  async updateTestimonial(
    @Param('id') id: string,
    @Body() body: Partial<TestimonialDto>,
  ) {
    return await this.portfolioService.updateArrayItem(
      this.prisma.testimonial as unknown as GenericModelDelegate,
      id,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('testimonials/:id')
  async deleteTestimonial(@Param('id') id: string) {
    return await this.portfolioService.deleteArrayItem(
      this.prisma.testimonial as unknown as GenericModelDelegate,
      id,
    );
  }

  // WORK (workExperience)
  @Get('work')
  async getWork() {
    return await this.portfolioService.getArrayData(
      this.prisma.workExperience as unknown as GenericModelDelegate,
    );
  }

  @UseGuards(JwtGuard)
  @Post('work')
  async createWork(@Body() body: WorkExperienceDto) {
    return await this.portfolioService.createArrayItem(
      this.prisma.workExperience as unknown as GenericModelDelegate,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Patch('work/:id')
  async updateWork(
    @Param('id') id: string,
    @Body() body: Partial<WorkExperienceDto>,
  ) {
    return await this.portfolioService.updateArrayItem(
      this.prisma.workExperience as unknown as GenericModelDelegate,
      id,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('work/:id')
  async deleteWork(@Param('id') id: string) {
    return await this.portfolioService.deleteArrayItem(
      this.prisma.workExperience as unknown as GenericModelDelegate,
      id,
    );
  }

  // CURRENT (currentFocus)
  @Get('current')
  async getCurrent() {
    return await this.portfolioService.getArrayData(
      this.prisma.currentFocus as unknown as GenericModelDelegate,
    );
  }

  @UseGuards(JwtGuard)
  @Post('current')
  async createCurrent(@Body() body: CurrentFocusDto) {
    return await this.portfolioService.createArrayItem(
      this.prisma.currentFocus as unknown as GenericModelDelegate,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Patch('current/:id')
  async updateCurrent(
    @Param('id') id: string,
    @Body() body: Partial<CurrentFocusDto>,
  ) {
    return await this.portfolioService.updateArrayItem(
      this.prisma.currentFocus as unknown as GenericModelDelegate,
      id,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('current/:id')
  async deleteCurrent(@Param('id') id: string) {
    return await this.portfolioService.deleteArrayItem(
      this.prisma.currentFocus as unknown as GenericModelDelegate,
      id,
    );
  }

  // PROFICIENCY
  @Get('proficiency')
  async getProficiency() {
    return await this.portfolioService.getProficiency();
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
    return await this.portfolioService.getArrayData(
      this.prisma.skill as unknown as GenericModelDelegate,
    );
  }

  @UseGuards(JwtGuard)
  @Post('skills')
  async createSkill(@Body() body: SkillDto) {
    return await this.portfolioService.createArrayItem(
      this.prisma.skill as unknown as GenericModelDelegate,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Patch('skills/:id')
  async updateSkill(@Param('id') id: string, @Body() body: Partial<SkillDto>) {
    return await this.portfolioService.updateArrayItem(
      this.prisma.skill as unknown as GenericModelDelegate,
      id,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('skills/:id')
  async deleteSkill(@Param('id') id: string) {
    return await this.portfolioService.deleteArrayItem(
      this.prisma.skill as unknown as GenericModelDelegate,
      id,
    );
  }

  // LEARNING (roadmap)
  @Get('learning')
  async getLearning() {
    const roadmap = await this.portfolioService.getArrayData(
      this.prisma.roadmap as unknown as GenericModelDelegate,
    );
    return { roadmap };
  }

  @UseGuards(JwtGuard)
  @Post('learning')
  async createLearning(@Body() body: RoadmapDto) {
    return await this.portfolioService.createArrayItem(
      this.prisma.roadmap as unknown as GenericModelDelegate,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Patch('learning/:id')
  async updateLearning(
    @Param('id') id: string,
    @Body() body: Partial<RoadmapDto>,
  ) {
    return await this.portfolioService.updateArrayItem(
      this.prisma.roadmap as unknown as GenericModelDelegate,
      id,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('learning/:id')
  async deleteLearning(@Param('id') id: string) {
    return await this.portfolioService.deleteArrayItem(
      this.prisma.roadmap as unknown as GenericModelDelegate,
      id,
    );
  }

  // PROJECTS
  @Get('projects')
  async getProjects() {
    return await this.portfolioService.getArrayData(
      this.prisma.project as unknown as GenericModelDelegate,
    );
  }

  @UseGuards(JwtGuard)
  @Post('projects')
  async createProject(@Body() body: ProjectDto) {
    return await this.portfolioService.createArrayItem(
      this.prisma.project as unknown as GenericModelDelegate,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Patch('projects/:id')
  async updateProject(
    @Param('id') id: string,
    @Body() body: Partial<ProjectDto>,
  ) {
    return await this.portfolioService.updateArrayItem(
      this.prisma.project as unknown as GenericModelDelegate,
      id,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('projects/:id')
  async deleteProject(@Param('id') id: string) {
    return await this.portfolioService.deleteArrayItem(
      this.prisma.project as unknown as GenericModelDelegate,
      id,
    );
  }

  // SYSTEM ARCHITECTURE
  @Get('architecture')
  async getArchitecture() {
    return await this.portfolioService.getArrayData(
      this.prisma.systemArchitecture as unknown as GenericModelDelegate,
    );
  }

  @UseGuards(JwtGuard)
  @Post('architecture')
  async createArchitecture(@Body() body: SystemArchitectureDto) {
    return await this.portfolioService.createArrayItem(
      this.prisma.systemArchitecture as unknown as GenericModelDelegate,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Patch('architecture/:id')
  async updateArchitecture(
    @Param('id') id: string,
    @Body() body: Partial<SystemArchitectureDto>,
  ) {
    return await this.portfolioService.updateArrayItem(
      this.prisma.systemArchitecture as unknown as GenericModelDelegate,
      id,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('architecture/:id')
  async deleteArchitecture(@Param('id') id: string) {
    return await this.portfolioService.deleteArrayItem(
      this.prisma.systemArchitecture as unknown as GenericModelDelegate,
      id,
    );
  }

  // PROJECT LIFECYCLE
  @Get('lifecycle')
  async getLifecycle() {
    return await this.portfolioService.getArrayData(
      this.prisma.projectLifecycle as unknown as GenericModelDelegate,
    );
  }

  @UseGuards(JwtGuard)
  @Post('lifecycle')
  async createLifecycle(@Body() body: ProjectLifecycleDto) {
    return await this.portfolioService.createArrayItem(
      this.prisma.projectLifecycle as unknown as GenericModelDelegate,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Patch('lifecycle/:id')
  async updateLifecycle(
    @Param('id') id: string,
    @Body() body: Partial<ProjectLifecycleDto>,
  ) {
    return await this.portfolioService.updateArrayItem(
      this.prisma.projectLifecycle as unknown as GenericModelDelegate,
      id,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('lifecycle/:id')
  async deleteLifecycle(@Param('id') id: string) {
    return await this.portfolioService.deleteArrayItem(
      this.prisma.projectLifecycle as unknown as GenericModelDelegate,
      id,
    );
  }
}
