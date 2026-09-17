import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCareerExperienceV2Dto,
  UpdateCareerExperienceV2Dto,
} from './experience-v2.dto';

@Injectable()
export class ExperienceV2Service {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const experiences = await this.prisma.careerExperienceV2.findMany({
      orderBy: { order: 'asc' },
    });
    return { experiences };
  }

  async findOne(id: string) {
    const exp = await this.prisma.careerExperienceV2.findUnique({
      where: { id },
    });
    if (!exp) {
      throw new NotFoundException(`Career experience with ID ${id} not found`);
    }
    return exp;
  }

  async create(data: CreateCareerExperienceV2Dto) {
    return await this.prisma.careerExperienceV2.create({
      data: {
        company: data.company,
        role: data.role,
        period: data.period,
        isActive: data.isActive ?? false,
        bullets: data.bullets as any,
        techTags: data.techTags,
        order: data.order ?? 0,
      },
    });
  }

  async update(id: string, data: UpdateCareerExperienceV2Dto) {
    await this.findOne(id);
    return await this.prisma.careerExperienceV2.update({
      where: { id },
      data: {
        ...(data.company !== undefined && { company: data.company }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.period !== undefined && { period: data.period }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.bullets !== undefined && { bullets: data.bullets as any }),
        ...(data.techTags !== undefined && { techTags: data.techTags }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.careerExperienceV2.delete({
      where: { id },
    });
  }
}
