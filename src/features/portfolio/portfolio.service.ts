import { Prisma } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HeroConfigDto, MetricDto, ProficiencyDto } from './portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  // ----------------------------------------------------
  // INTERNAL HELPERS — type-safe wrappers over Prisma delegates
  // ----------------------------------------------------

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

  // ----------------------------------------------------
  // STATUS
  // ----------------------------------------------------

  async getStatus(): Promise<string> {
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

  // ----------------------------------------------------
  // HERO — HeroConfig + Metrics
  // ----------------------------------------------------

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
      await this.prisma.metric.deleteMany();
      if (metricsPayload.length > 0) {
        await this.prisma.metric.createMany({
          data: metricsPayload as Prisma.MetricCreateManyInput[],
        });
      }
    }

    return { success: true };
  }

  // ----------------------------------------------------
  // TESTIMONIALS
  // ----------------------------------------------------

  async getTestimonials() {
    return this.getMany(this.prisma.testimonial);
  }

  async getTestimonial(id: string) {
    return this.getById(this.prisma.testimonial, id);
  }

  async createTestimonial(data: any) {
    return this.createOne(this.prisma.testimonial, data);
  }

  async updateTestimonial(id: string, data: any) {
    return this.updateOne(this.prisma.testimonial, id, data);
  }

  async deleteTestimonial(id: string) {
    return this.deleteOne(this.prisma.testimonial, id);
  }

  // ----------------------------------------------------
  // WORK EXPERIENCE
  // ----------------------------------------------------

  async getWorkExperiences() {
    return this.getMany(this.prisma.workExperience);
  }

  async getWorkExperience(id: string) {
    return this.getById(this.prisma.workExperience, id);
  }

  async createWorkExperience(data: any) {
    return this.createOne(this.prisma.workExperience, data);
  }

  async updateWorkExperience(id: string, data: any) {
    return this.updateOne(this.prisma.workExperience, id, data);
  }

  async deleteWorkExperience(id: string) {
    return this.deleteOne(this.prisma.workExperience, id);
  }

  // ----------------------------------------------------
  // CURRENT FOCUS
  // ----------------------------------------------------

  async getCurrentFoci() {
    return this.getMany(this.prisma.currentFocus);
  }

  async getCurrentFocus(id: string) {
    return this.getById(this.prisma.currentFocus, id);
  }

  async createCurrentFocus(data: any) {
    return this.createOne(this.prisma.currentFocus, data);
  }

  async updateCurrentFocus(id: string, data: any) {
    return this.updateOne(this.prisma.currentFocus, id, data);
  }

  async deleteCurrentFocus(id: string) {
    return this.deleteOne(this.prisma.currentFocus, id);
  }

  // ----------------------------------------------------
  // PROFICIENCY (with nested ProficiencySkill relations)
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
              create:
                skills as Prisma.ProficiencySkillCreateWithoutProficiencyInput[],
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
                create:
                  skills as Prisma.ProficiencySkillCreateWithoutProficiencyInput[],
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
  // ROADMAP
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

  // ----------------------------------------------------
  // PROJECTS
  // ----------------------------------------------------

  async getProjects() {
    return this.getMany(this.prisma.project);
  }

  async getProject(id: string) {
    return this.getById(this.prisma.project, id);
  }

  async createProject(data: any) {
    return this.createOne(this.prisma.project, data);
  }

  async updateProject(id: string, data: any) {
    return this.updateOne(this.prisma.project, id, data);
  }

  async deleteProject(id: string) {
    return this.deleteOne(this.prisma.project, id);
  }

  // ----------------------------------------------------
  // SYSTEM ARCHITECTURE
  // ----------------------------------------------------

  async getSystemArchitectures() {
    return this.getMany(this.prisma.systemArchitecture);
  }

  async getSystemArchitecture(id: string) {
    return this.getById(this.prisma.systemArchitecture, id);
  }

  async createSystemArchitecture(data: any) {
    return this.createOne(this.prisma.systemArchitecture, data);
  }

  async updateSystemArchitecture(id: string, data: any) {
    return this.updateOne(this.prisma.systemArchitecture, id, data);
  }

  async deleteSystemArchitecture(id: string) {
    return this.deleteOne(this.prisma.systemArchitecture, id);
  }

  // ----------------------------------------------------
  // PROJECT LIFECYCLE
  // ----------------------------------------------------

  async getProjectLifecycles() {
    return this.getMany(this.prisma.projectLifecycle);
  }

  async getProjectLifecycle(id: string) {
    return this.getById(this.prisma.projectLifecycle, id);
  }

  async createProjectLifecycle(data: any) {
    return this.createOne(this.prisma.projectLifecycle, data);
  }

  async updateProjectLifecycle(id: string, data: any) {
    return this.updateOne(this.prisma.projectLifecycle, id, data);
  }

  async deleteProjectLifecycle(id: string) {
    return this.deleteOne(this.prisma.projectLifecycle, id);
  }
}
