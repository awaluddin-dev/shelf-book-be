import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService {
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
