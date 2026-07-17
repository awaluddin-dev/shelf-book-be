import { Prisma } from '@prisma/client';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HeroConfigDto, MetricDto, ProficiencyDto } from './portfolio.dto';

export interface GenericModelDelegate {
  findMany(args?: unknown): Promise<unknown[]>;
  findUnique(args: { where: { id: string } }): Promise<unknown>;
  create(args: { data: unknown }): Promise<unknown>;
  update(args: { where: { id: string }; data: unknown }): Promise<unknown>;
  delete(args: { where: { id: string } }): Promise<unknown>;
}

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  // ----------------------------------------------------
  // GENERIC METHODS FOR SIMPLE ARRAYS (Work, Testimonial, CurrentFocus, Skill, Roadmap, Project)
  // ----------------------------------------------------

  async getArrayData(model: GenericModelDelegate) {
    return await model.findMany();
  }

  async getArrayItem(model: GenericModelDelegate, id: string) {
    const item = await model.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }

  async createArrayItem<T>(
    model: GenericModelDelegate,
    payload: T,
  ): Promise<unknown> {
    // If frontend sends an id, we can try to use it, else let Prisma handle it
    return await model.create({ data: payload as unknown });
  }

  async updateArrayItem<T>(
    model: GenericModelDelegate,
    id: string,
    payload: T,
  ): Promise<unknown> {
    try {
      return await model.update({ where: { id }, data: payload as unknown });
    } catch {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
  }

  async deleteArrayItem(model: GenericModelDelegate, id: string) {
    try {
      await model.delete({ where: { id } });
      return { success: true };
    } catch {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
  }

  // ----------------------------------------------------
  // SPECIFIC METHODS FOR NESTED/COMPLEX DATA
  // ----------------------------------------------------

  // PROFICIENCY (Includes relation to ProficiencySkill)
  async getProficiency() {
    return await this.prisma.proficiency.findMany({
      include: { skills: true },
    });
  }

  async createProficiency(payload: ProficiencyDto) {
    const { skills, ...rest } = payload;
    return await this.prisma.proficiency.create({
      data: {
        ...rest,
        skills: skills
          ? {
              create:
                skills as unknown as Prisma.ProficiencySkillCreateWithoutProficiencyInput[],
            }
          : undefined,
      },
      include: { skills: true },
    });
  }

  async updateProficiency(id: string, payload: Partial<ProficiencyDto>) {
    const { skills, ...rest } = payload;
    // To update correctly with relations, we update the parent, and if skills are provided,
    // we would typically delete old and recreate, or update by ID.
    // For simplicity, we just delete all skills and recreate if skills array is present.
    if (skills) {
      await this.prisma.proficiencySkill.deleteMany({
        where: { proficiencyId: id },
      });
    }

    return await this.prisma.proficiency.update({
      where: { id },
      data: {
        ...rest,
        skills: skills
          ? {
              create:
                skills as unknown as Prisma.ProficiencySkillCreateWithoutProficiencyInput[],
            }
          : undefined,
      },
      include: { skills: true },
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

  // STATUS
  async getStatus() {
    const statusObj = await this.prisma.portfolioStatus.findUnique({
      where: { id: 'status_1' },
    });
    return statusObj ? statusObj.status : 'busy';
  }

  async updateStatus(status: string) {
    await this.prisma.portfolioStatus.upsert({
      where: { id: 'status_1' },
      update: { status },
      create: { id: 'status_1', status },
    });
    return { success: true, status };
  }

  // HERO (HeroConfig + Metrics)
  async getHero() {
    const heroConfig =
      (await this.prisma.heroConfig.findUnique({
        where: { id: 'hero_1' },
      })) || {};

    const metrics = await this.prisma.metric.findMany();

    return { heroConfig, metrics };
  }

  async updateHero(
    heroConfigPayload?: Partial<HeroConfigDto>,
    metricsPayload?: MetricDto[],
  ) {
    if (heroConfigPayload) {
      await this.prisma.heroConfig.upsert({
        where: { id: 'hero_1' },
        update: heroConfigPayload,
        create: { id: 'hero_1', ...heroConfigPayload },
      });
    }

    if (metricsPayload) {
      // Simplest way is to wipe existing metrics and insert new ones
      // since there are usually only 3 or 4 metrics
      await this.prisma.metric.deleteMany();
      if (metricsPayload.length > 0) {
        await this.prisma.metric.createMany({
          data: metricsPayload as unknown as Prisma.MetricCreateManyInput[],
        });
      }
    }

    return { success: true };
  }
}
