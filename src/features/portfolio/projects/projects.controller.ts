import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  ProjectDto,
  SystemArchitectureDto,
  ProjectLifecycleDto,
} from './projects.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // PROJECTS
  @Get('projects')
  async getProjects() {
    return await this.projectsService.getProjects();
  }

  @UseGuards(JwtGuard)
  @Post('projects')
  async createProject(@Body() body: ProjectDto) {
    return await this.projectsService.createProject(body);
  }

  @UseGuards(JwtGuard)
  @Patch('projects/:id')
  async updateProject(
    @Param('id') id: string,
    @Body() body: Partial<ProjectDto>,
  ) {
    return await this.projectsService.updateProject(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('projects/:id')
  async deleteProject(@Param('id') id: string) {
    return await this.projectsService.deleteProject(id);
  }

  // SYSTEM ARCHITECTURE
  @Get('architecture')
  async getArchitecture() {
    return await this.projectsService.getSystemArchitectures();
  }

  @UseGuards(JwtGuard)
  @Post('architecture')
  async createArchitecture(@Body() body: SystemArchitectureDto) {
    return await this.projectsService.createSystemArchitecture(body);
  }

  @UseGuards(JwtGuard)
  @Patch('architecture/:id')
  async updateArchitecture(
    @Param('id') id: string,
    @Body() body: Partial<SystemArchitectureDto>,
  ) {
    return await this.projectsService.updateSystemArchitecture(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('architecture/:id')
  async deleteArchitecture(@Param('id') id: string) {
    return await this.projectsService.deleteSystemArchitecture(id);
  }

  // PROJECT LIFECYCLE
  @Get('lifecycle')
  async getLifecycle() {
    return await this.projectsService.getProjectLifecycles();
  }

  @UseGuards(JwtGuard)
  @Post('lifecycle')
  async createLifecycle(@Body() body: ProjectLifecycleDto) {
    return await this.projectsService.createProjectLifecycle(body);
  }

  @UseGuards(JwtGuard)
  @Patch('lifecycle/:id')
  async updateLifecycle(
    @Param('id') id: string,
    @Body() body: Partial<ProjectLifecycleDto>,
  ) {
    return await this.projectsService.updateProjectLifecycle(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('lifecycle/:id')
  async deleteLifecycle(@Param('id') id: string) {
    return await this.projectsService.deleteProjectLifecycle(id);
  }
}
