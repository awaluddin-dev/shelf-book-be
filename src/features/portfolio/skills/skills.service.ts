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
    const skills = await this.prisma.skill.findMany({
      include: { category: true, proficiencySkill: true },
    });
    return skills.map((s) => ({
      ...s,
      category: s.category?.title || '',
      categoryObj: s.category,
    }));
  }

  async getSkill(id: string) {
    const s = await this.prisma.skill.findUnique({
      where: { id },
      include: { category: true, proficiencySkill: true },
    });
    if (!s) throw new NotFoundException(`Skill with id ${id} not found`);
    return {
      ...s,
      category: s.category?.title || '',
      categoryObj: s.category,
    };
  }

  async createSkill(data: Record<string, any>) {
    delete data.category;
    delete data.categoryObj;
    return this.prisma.skill.create({
      data,
      include: { category: true, proficiencySkill: true },
    });
  }

  async updateSkill(id: string, data: Record<string, any>) {
    delete data.category;
    delete data.categoryObj;
    return this.prisma.skill.update({
      where: { id },
      data,
      include: { category: true, proficiencySkill: true },
    });
  }

  async deleteSkill(id: string) {
    return this.deleteOne(this.prisma.skill, id);
  }

  // ----------------------------------------------------
  // ROADMAP (LEARNING)
  // ----------------------------------------------------

  async getRoadmaps() {
    return this.prisma.roadmap.findMany({
      include: { currentFocuses: true },
    });
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
