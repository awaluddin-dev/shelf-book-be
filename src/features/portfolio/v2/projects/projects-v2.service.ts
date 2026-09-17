import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectV2Dto, UpdateProjectV2Dto } from './projects-v2.dto';

@Injectable()
export class ProjectsV2Service {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const projects = await this.prisma.projectV2.findMany({
      orderBy: { order: 'asc' },
    });
    return { projects };
  }

  async findOne(id: string) {
    const project = await this.prisma.projectV2.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async create(data: CreateProjectV2Dto) {
    return await this.prisma.projectV2.create({
      data: {
        title: data.title,
        subtitle: data.subtitle ?? '',
        category: data.category,
        date: data.date,
        tags: data.tags ?? [],
        domainBadge: data.domainBadge,
        problem: data.problem,
        solution: data.solution,
        pipelineFlow: data.pipelineFlow ?? [],
        spineColor: data.spineColor ?? '#0f4c75',
        coverColor: data.coverColor ?? '#142028',
        spineText: data.spineText ?? data.title,
        github: data.github,
        demoUrl: data.demoUrl,
        stats: data.stats ?? [],
        phases: data.phases ?? [],
        markdown: data.markdown ?? '',
        order: data.order ?? 0,
      },
    });
  }

  async update(id: string, data: UpdateProjectV2Dto) {
    await this.findOne(id);
    return await this.prisma.projectV2.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.subtitle !== undefined && { subtitle: data.subtitle }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.date !== undefined && { date: data.date }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.domainBadge !== undefined && { domainBadge: data.domainBadge }),
        ...(data.problem !== undefined && { problem: data.problem }),
        ...(data.solution !== undefined && { solution: data.solution }),
        ...(data.pipelineFlow !== undefined && { pipelineFlow: data.pipelineFlow }),
        ...(data.spineColor !== undefined && { spineColor: data.spineColor }),
        ...(data.coverColor !== undefined && { coverColor: data.coverColor }),
        ...(data.spineText !== undefined && { spineText: data.spineText }),
        ...(data.github !== undefined && { github: data.github }),
        ...(data.demoUrl !== undefined && { demoUrl: data.demoUrl }),
        ...(data.stats !== undefined && { stats: data.stats }),
        ...(data.phases !== undefined && { phases: data.phases }),
        ...(data.markdown !== undefined && { markdown: data.markdown }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.projectV2.delete({
      where: { id },
    });
  }
}
