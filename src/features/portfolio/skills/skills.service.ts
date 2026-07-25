import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseCrudService } from 'src/common/services/base-crud.service';
import { ProficiencyDto } from './skills.dto';

@Injectable()
export class SkillsService extends BaseCrudService {
  constructor(private prisma: PrismaService) {
    super();
  }

  // ----------------------------------------------------
  // PROFICIENCY
  // ----------------------------------------------------

  async getProficiencies() {
    return this.prisma.proficiency.findMany({
      include: { skills: true },
    });
  }

  async createProficiency(payload: ProficiencyDto) {
    const { skills, ...rest } = payload;
    return this.prisma.proficiency.create({
      data: {
        ...rest,
        skills: skills
          ? {
              create: skills,
            }
          : undefined,
      },
      include: { skills: true },
    });
  }

  async updateProficiency(id: string, payload: Partial<ProficiencyDto>) {
    const { skills, ...rest } = payload;

    return this.prisma.$transaction(async (tx) => {
      if (skills) {
        await tx.proficiencySkill.deleteMany({
          where: { proficiencyId: id },
        });
      }

      return tx.proficiency.update({
        where: { id },
        data: {
          ...rest,
          skills: skills
            ? {
                create: skills,
              }
            : undefined,
        },
        include: { skills: true },
      });
    });
  }

  async deleteProficiency(id: string) {
    try {
      await this.prisma.proficiency.delete({ where: { id } });
      return { success: true };
    } catch {
      throw new NotFoundException(`Proficiency with id ${id} not found`);
    }
  }

  // ----------------------------------------------------
  // SKILLS
  // ----------------------------------------------------

  async getSkills() {
    return this.getMany(this.prisma.skill);
  }

  async getSkill(id: string) {
    return this.getById(this.prisma.skill, id);
  }

  async createSkill(data: any) {
    return this.createOne(this.prisma.skill, data);
  }

  async updateSkill(id: string, data: any) {
    return this.updateOne(this.prisma.skill, id, data);
  }

  async deleteSkill(id: string) {
    return this.deleteOne(this.prisma.skill, id);
  }

  // ----------------------------------------------------
  // ROADMAP (LEARNING)
  // ----------------------------------------------------

  async getRoadmaps() {
    return this.getMany(this.prisma.roadmap);
  }

  async getRoadmap(id: string) {
    return this.getById(this.prisma.roadmap, id);
  }

  async createRoadmap(data: any) {
    return this.createOne(this.prisma.roadmap, data);
  }

  async updateRoadmap(id: string, data: any) {
    return this.updateOne(this.prisma.roadmap, id, data);
  }

  async deleteRoadmap(id: string) {
    return this.deleteOne(this.prisma.roadmap, id);
  }
}
