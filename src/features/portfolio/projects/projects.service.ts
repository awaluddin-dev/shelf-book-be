import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseCrudService } from 'src/common/services/base-crud.service';

@Injectable()
export class ProjectsService extends BaseCrudService {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  // ----------------------------------------------------
  // PROJECTS
  // ----------------------------------------------------

  async getProjects() {
    return this.prisma.project.findMany({
      include: {
        systemArchitectures: {
          orderBy: {
            order: 'asc'
          }
        },
        projectLifecycles: {
          orderBy: { order: 'asc' }
        },
        technicalImagery: true,
        projectDatabaseSchemas: {
          orderBy: { order: 'asc' }
        },
        projectErds: {
          orderBy: { order: 'asc' }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProject(id: string) {
    const item = await this.prisma.project.findUnique({
      where: { id },
      include: {
        systemArchitectures: { orderBy: { order: 'asc' } },
        projectLifecycles: { orderBy: { order: 'asc' } },
        technicalImagery: true,
        projectDatabaseSchemas: { orderBy: { order: 'asc' } },
        projectErds: { orderBy: { order: 'asc' } },
      },
    });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
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

  // ----------------------------------------------------
  // TECHNICAL IMAGERY
  // ----------------------------------------------------

  async getTechnicalImageries() {
    return this.getMany(this.prisma.technicalImagery);
  }

  async getTechnicalImagery(id: string) {
    return this.getById(this.prisma.technicalImagery, id);
  }

  async upsertTechnicalImagery(projectId: string, data: any) {
    return this.prisma.technicalImagery.upsert({
      where: { projectId },
      update: data,
      create: { ...data, projectId },
    });
  }

  async deleteTechnicalImagery(id: string) {
    return this.deleteOne(this.prisma.technicalImagery, id);
  }

  async updateTechnicalImagery(id: string, data: any) {
    return this.updateOne(this.prisma.technicalImagery, id, data);
  }

  // ----------------------------------------------------
  // PROJECT DATABASE SCHEMA
  // ----------------------------------------------------

  async getProjectDatabaseSchemas() {
    return this.getMany(this.prisma.projectDatabaseSchema);
  }

  async createProjectDatabaseSchema(data: any) {
    return this.createOne(this.prisma.projectDatabaseSchema, data);
  }

  async updateProjectDatabaseSchema(id: string, data: any) {
    return this.updateOne(this.prisma.projectDatabaseSchema, id, data);
  }

  async deleteProjectDatabaseSchema(id: string) {
    return this.deleteOne(this.prisma.projectDatabaseSchema, id);
  }

  // ----------------------------------------------------
  // PROJECT ERD
  // ----------------------------------------------------

  async getProjectErds() {
    return this.getMany(this.prisma.projectErd);
  }

  async createProjectErd(data: any) {
    return this.createOne(this.prisma.projectErd, data);
  }

  async updateProjectErd(id: string, data: any) {
    return this.updateOne(this.prisma.projectErd, id, data);
  }

  async deleteProjectErd(id: string) {
    return this.deleteOne(this.prisma.projectErd, id);
  }
}

