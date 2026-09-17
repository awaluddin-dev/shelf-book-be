import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateProficiencyPillarV2Dto,
  UpdateProficiencyPillarV2Dto,
} from './proficiency-v2.dto';

@Injectable()
export class ProficiencyV2Service {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const pillars = await this.prisma.proficiencyPillarV2.findMany({
      orderBy: { order: 'asc' },
    });
    return { pillars };
  }

  async findOne(id: string) {
    const pillar = await this.prisma.proficiencyPillarV2.findUnique({
      where: { id },
    });
    if (!pillar) {
      throw new NotFoundException(`Proficiency pillar with ID ${id} not found`);
    }
    return pillar;
  }

  async create(data: CreateProficiencyPillarV2Dto) {
    return await this.prisma.proficiencyPillarV2.create({
      data: {
        pillarNumber: data.pillarNumber,
        title: data.title,
        description: data.description,
        icon: data.icon,
        skills: data.skills as any,
        order: data.order ?? 0,
      },
    });
  }

  async update(id: string, data: UpdateProficiencyPillarV2Dto) {
    await this.findOne(id);
    return await this.prisma.proficiencyPillarV2.update({
      where: { id },
      data: {
        ...(data.pillarNumber !== undefined && { pillarNumber: data.pillarNumber }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.skills !== undefined && { skills: data.skills as any }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.proficiencyPillarV2.delete({
      where: { id },
    });
  }
}
