import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseCrudService } from 'src/common/services/base-crud.service';
import {
  TestimonialDto,
  WorkExperienceDto,
  CurrentFocusDto,
} from './experience.dto';

@Injectable()
export class ExperienceService extends BaseCrudService {
  constructor(private prisma: PrismaService) {
    super();
  }

  // TESTIMONIALS
  async getTestimonials() {
    return this.getMany(this.prisma.testimonial);
  }

  async getTestimonial(id: string) {
    return this.getById(this.prisma.testimonial, id);
  }

  async createTestimonial(data: TestimonialDto) {
    return this.createOne(this.prisma.testimonial, data);
  }

  async updateTestimonial(id: string, data: Partial<TestimonialDto>) {
    return this.updateOne(this.prisma.testimonial, id, data);
  }

  async deleteTestimonial(id: string) {
    return this.deleteOne(this.prisma.testimonial, id);
  }

  // WORK EXPERIENCE
  async getWorkExperiences() {
    return this.getMany(this.prisma.workExperience);
  }

  async getWorkExperience(id: string) {
    return this.getById(this.prisma.workExperience, id);
  }

  async createWorkExperience(data: WorkExperienceDto) {
    return this.createOne(this.prisma.workExperience, data);
  }

  async updateWorkExperience(id: string, data: Partial<WorkExperienceDto>) {
    return this.updateOne(this.prisma.workExperience, id, data);
  }

  async deleteWorkExperience(id: string) {
    return this.deleteOne(this.prisma.workExperience, id);
  }

  // CURRENT FOCUS
  async getCurrentFoci() {
    return this.getMany(this.prisma.currentFocus);
  }

  async getCurrentFocus(id: string) {
    return this.getById(this.prisma.currentFocus, id);
  }

  async createCurrentFocus(data: CurrentFocusDto) {
    return this.createOne(this.prisma.currentFocus, data);
  }

  async updateCurrentFocus(id: string, data: Partial<CurrentFocusDto>) {
    return this.updateOne(this.prisma.currentFocus, id, data);
  }

  async deleteCurrentFocus(id: string) {
    return this.deleteOne(this.prisma.currentFocus, id);
  }
}
