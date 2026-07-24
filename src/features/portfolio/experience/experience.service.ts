import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TestimonialDto, WorkExperienceDto, CurrentFocusDto } from './experience.dto';

@Injectable()
export class ExperienceService {
  constructor(private prisma: PrismaService) {}

  private async getMany<T>(delegate: {
    findMany: (args?: any) => Promise<T[]>;
  }): Promise<T[]> {
    return delegate.findMany();
  }

  private async getById<T extends { id: string }>(
    delegate: {
      findUnique: (args: { where: { id: string } }) => Promise<T | null>;
    },
    id: string,
  ): Promise<T> {
    const item = await delegate.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }

  private async createOne<T, D>(
    delegate: { create: (args: { data: D }) => Promise<T> },
    data: D,
  ): Promise<T> {
    return delegate.create({ data });
  }

  private async updateOne<T, D>(
    delegate: {
      update: (args: { where: { id: string }; data: D }) => Promise<T>;
    },
    id: string,
    data: D,
  ): Promise<T> {
    try {
      return await delegate.update({ where: { id }, data });
    } catch {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
  }

  private async deleteOne<T>(
    delegate: { delete: (args: { where: { id: string } }) => Promise<T> },
    id: string,
  ): Promise<{ success: boolean }> {
    try {
      await delegate.delete({ where: { id } });
      return { success: true };
    } catch {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
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
