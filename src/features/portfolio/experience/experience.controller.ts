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
import { ExperienceService } from './experience.service';
import {
  TestimonialDto,
  WorkExperienceDto,
  CurrentFocusDto,
} from './experience.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Experience')
@Controller()
export class ExperienceController {
  constructor(
    private readonly experienceService: ExperienceService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  // TESTIMONIALS (rate-limited for public submission)
  @Get('testimonials')
  async getTestimonials() {
    return await this.experienceService.getTestimonials();
  }

  @Post('testimonials')
  async createTestimonial(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() body: TestimonialDto,
  ) {
    await this.rateLimitService.checkLimit(req);
    const result = await this.experienceService.createTestimonial(body);
    await this.rateLimitService.setLimit(req, res);
    return result;
  }

  @UseGuards(JwtGuard)
  @Patch('testimonials/:id')
  async updateTestimonial(
    @Param('id') id: string,
    @Body() body: Partial<TestimonialDto>,
  ) {
    return await this.experienceService.updateTestimonial(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('testimonials/:id')
  async deleteTestimonial(@Param('id') id: string) {
    return await this.experienceService.deleteTestimonial(id);
  }

  // WORK (workExperience)
  @Get('work')
  async getWork() {
    return await this.experienceService.getWorkExperiences();
  }

  @UseGuards(JwtGuard)
  @Post('work')
  async createWork(@Body() body: WorkExperienceDto) {
    return await this.experienceService.createWorkExperience(body);
  }

  @UseGuards(JwtGuard)
  @Patch('work/:id')
  async updateWork(
    @Param('id') id: string,
    @Body() body: Partial<WorkExperienceDto>,
  ) {
    return await this.experienceService.updateWorkExperience(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('work/:id')
  async deleteWork(@Param('id') id: string) {
    return await this.experienceService.deleteWorkExperience(id);
  }

  // CURRENT (currentFocus)
  @Get('current')
  async getCurrent() {
    return await this.experienceService.getCurrentFoci();
  }

  @UseGuards(JwtGuard)
  @Post('current')
  async createCurrent(@Body() body: CurrentFocusDto) {
    return await this.experienceService.createCurrentFocus(body);
  }

  @UseGuards(JwtGuard)
  @Patch('current/:id')
  async updateCurrent(
    @Param('id') id: string,
    @Body() body: Partial<CurrentFocusDto>,
  ) {
    return await this.experienceService.updateCurrentFocus(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('current/:id')
  async deleteCurrent(@Param('id') id: string) {
    return await this.experienceService.deleteCurrentFocus(id);
  }
}
