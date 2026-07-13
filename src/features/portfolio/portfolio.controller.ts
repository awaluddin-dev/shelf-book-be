/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('Portfolio')
@Controller()
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly prisma: PrismaService,
  ) {}

  // STATUS
  @Get('status')
  async getStatus() {
    return { status: await this.portfolioService.getStatus() };
  }

  @UseGuards(JwtGuard)
  @Post('status')
  async updateStatus(@Body() body: any) {
    return await this.portfolioService.updateStatus(body.status);
  }

  // HERO
  @Get('hero')
  async getHero() {
    return await this.portfolioService.getHero();
  }

  @UseGuards(JwtGuard)
  @Patch('hero')
  async updateHero(@Body() body: any) {
    return await this.portfolioService.updateHero(
      body.heroConfig,
      body.metrics,
    );
  }

  // TESTIMONIALS
  @Get('testimonials')
  async getTestimonials() {
    return await this.portfolioService.getArrayData(this.prisma.testimonial);
  }

  @Post('testimonials')
  async createTestimonial(@Body() body: any) {
    return await this.portfolioService.createArrayItem(
      this.prisma.testimonial,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Put('testimonials/:id')
  async updateTestimonial(@Param('id') id: string, @Body() body: any) {
    return await this.portfolioService.updateArrayItem(
      this.prisma.testimonial,
      id,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('testimonials/:id')
  async deleteTestimonial(@Param('id') id: string) {
    return await this.portfolioService.deleteArrayItem(
      this.prisma.testimonial,
      id,
    );
  }

  // WORK (workExperience)
  @Get('work')
  async getWork() {
    return await this.portfolioService.getArrayData(this.prisma.workExperience);
  }

  @UseGuards(JwtGuard)
  @Post('work')
  async createWork(@Body() body: any) {
    return await this.portfolioService.createArrayItem(
      this.prisma.workExperience,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Put('work/:id')
  async updateWork(@Param('id') id: string, @Body() body: any) {
    return await this.portfolioService.updateArrayItem(
      this.prisma.workExperience,
      id,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('work/:id')
  async deleteWork(@Param('id') id: string) {
    return await this.portfolioService.deleteArrayItem(
      this.prisma.workExperience,
      id,
    );
  }

  // CURRENT (currentFocus)
  @Get('current')
  async getCurrent() {
    return await this.portfolioService.getArrayData(this.prisma.currentFocus);
  }

  @UseGuards(JwtGuard)
  @Post('current')
  async createCurrent(@Body() body: any) {
    return await this.portfolioService.createArrayItem(
      this.prisma.currentFocus,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Put('current/:id')
  async updateCurrent(@Param('id') id: string, @Body() body: any) {
    return await this.portfolioService.updateArrayItem(
      this.prisma.currentFocus,
      id,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('current/:id')
  async deleteCurrent(@Param('id') id: string) {
    return await this.portfolioService.deleteArrayItem(
      this.prisma.currentFocus,
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
  async createProficiency(@Body() body: any) {
    return await this.portfolioService.createProficiency(body);
  }

  @UseGuards(JwtGuard)
  @Put('proficiency/:id')
  async updateProficiency(@Param('id') id: string, @Body() body: any) {
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
    return await this.portfolioService.getArrayData(this.prisma.skill);
  }

  @UseGuards(JwtGuard)
  @Post('skills')
  async createSkill(@Body() body: any) {
    return await this.portfolioService.createArrayItem(this.prisma.skill, body);
  }

  @UseGuards(JwtGuard)
  @Put('skills/:id')
  async updateSkill(@Param('id') id: string, @Body() body: any) {
    return await this.portfolioService.updateArrayItem(
      this.prisma.skill,
      id,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('skills/:id')
  async deleteSkill(@Param('id') id: string) {
    return await this.portfolioService.deleteArrayItem(this.prisma.skill, id);
  }

  // LEARNING (roadmap)
  @Get('learning')
  async getLearning() {
    const roadmap = await this.portfolioService.getArrayData(
      this.prisma.roadmap,
    );
    return { roadmap };
  }

  @UseGuards(JwtGuard)
  @Post('learning')
  async createLearning(@Body() body: any) {
    return await this.portfolioService.createArrayItem(
      this.prisma.roadmap,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Put('learning/:id')
  async updateLearning(@Param('id') id: string, @Body() body: any) {
    return await this.portfolioService.updateArrayItem(
      this.prisma.roadmap,
      id,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('learning/:id')
  async deleteLearning(@Param('id') id: string) {
    return await this.portfolioService.deleteArrayItem(this.prisma.roadmap, id);
  }

  // PROJECTS
  @Get('projects')
  async getProjects() {
    return await this.portfolioService.getArrayData(this.prisma.project);
  }

  @UseGuards(JwtGuard)
  @Post('projects')
  async createProject(@Body() body: any) {
    return await this.portfolioService.createArrayItem(
      this.prisma.project,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Put('projects/:id')
  async updateProject(@Param('id') id: string, @Body() body: any) {
    return await this.portfolioService.updateArrayItem(
      this.prisma.project,
      id,
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('projects/:id')
  async deleteProject(@Param('id') id: string) {
    return await this.portfolioService.deleteArrayItem(this.prisma.project, id);
  }
}
