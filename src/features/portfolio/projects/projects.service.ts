import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseCrudService } from 'src/common/services/base-crud.service';

@Injectable()
export class ProjectsService extends BaseCrudService {
  constructor(private prisma: PrismaService) {
    super();
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
