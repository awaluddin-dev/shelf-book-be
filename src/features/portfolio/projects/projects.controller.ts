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
  TechnicalImageryDto,
  ProjectDatabaseSchemaDto,
  ProjectErdDto,
} from './projects.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Projects')
@ApiResponse({ status: 400, description: 'Bad Request', schema: { example: { statusCode: 400, message: ['Validation failed'], error: 'Bad Request' } } })
@ApiResponse({ status: 401, description: 'Unauthorized', schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
@ApiResponse({ status: 403, description: 'Forbidden', schema: { example: { statusCode: 403, message: 'Forbidden resource', error: 'Forbidden' } } })
@ApiResponse({ status: 404, description: 'Not Found', schema: { example: { statusCode: 404, message: 'Resource not found', error: 'Not Found' } } })
@ApiResponse({ status: 429, description: 'Too Many Requests', schema: { example: { statusCode: 429, message: 'Too many requests, please try again later.', error: 'Too Many Requests' } } })
@ApiResponse({ status: 500, description: 'Internal Server Error', schema: { example: { statusCode: 500, message: 'Internal server error' } } })
@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // PROJECTS
  @Get('projects')
  @ApiOperation({ summary: 'Retrieve all projects' })
  @ApiResponse({ status: 200, description: 'List of projects successfully retrieved.', type: [ProjectDto] })
  async getProjects() {
    return await this.projectsService.getProjects();
  }

  @UseGuards(JwtGuard)
  @Post('projects')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project successfully created.', type: ProjectDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  async createProject(@Body() body: ProjectDto) {
    return await this.projectsService.createProject(body);
  }

  @UseGuards(JwtGuard)
  @Patch('projects/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing project' })
  @ApiResponse({ status: 200, description: 'Project successfully updated.', type: ProjectDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async updateProject(
    @Param('id') id: string,
    @Body() body: Partial<ProjectDto>,
  ) {
    return await this.projectsService.updateProject(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('projects/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project successfully deleted.', type: ProjectDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async deleteProject(@Param('id') id: string) {
    return await this.projectsService.deleteProject(id);
  }

  // SYSTEM ARCHITECTURE
  @Get('architecture')
  @ApiOperation({ summary: 'Retrieve system architectures' })
  @ApiResponse({ status: 200, description: 'System architectures successfully retrieved.', type: [SystemArchitectureDto] })
  async getArchitecture() {
    return await this.projectsService.getSystemArchitectures();
  }

  @UseGuards(JwtGuard)
  @Post('architecture')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a system architecture' })
  @ApiResponse({ status: 201, description: 'System architecture successfully created.', type: SystemArchitectureDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  async createArchitecture(@Body() body: SystemArchitectureDto) {
    return await this.projectsService.createSystemArchitecture(body);
  }

  @UseGuards(JwtGuard)
  @Patch('architecture/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing system architecture' })
  @ApiResponse({ status: 200, description: 'System architecture successfully updated.', type: SystemArchitectureDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  @ApiResponse({ status: 404, description: 'System architecture not found.' })
  async updateArchitecture(
    @Param('id') id: string,
    @Body() body: Partial<SystemArchitectureDto>,
  ) {
    return await this.projectsService.updateSystemArchitecture(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('architecture/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a system architecture' })
  @ApiResponse({ status: 200, description: 'System architecture successfully deleted.', type: SystemArchitectureDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  @ApiResponse({ status: 404, description: 'System architecture not found.' })
  async deleteArchitecture(@Param('id') id: string) {
    return await this.projectsService.deleteSystemArchitecture(id);
  }

  // PROJECT LIFECYCLE
  @Get('lifecycle')
  @ApiOperation({ summary: 'Retrieve project lifecycles' })
  @ApiResponse({ status: 200, description: 'Project lifecycles successfully retrieved.', type: [ProjectLifecycleDto] })
  async getLifecycle() {
    return await this.projectsService.getProjectLifecycles();
  }

  @UseGuards(JwtGuard)
  @Post('lifecycle')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a project lifecycle' })
  @ApiResponse({ status: 201, description: 'Project lifecycle successfully created.', type: ProjectLifecycleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  async createLifecycle(@Body() body: ProjectLifecycleDto) {
    return await this.projectsService.createProjectLifecycle(body);
  }

  @UseGuards(JwtGuard)
  @Patch('lifecycle/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing project lifecycle' })
  @ApiResponse({ status: 200, description: 'Project lifecycle successfully updated.', type: ProjectLifecycleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  @ApiResponse({ status: 404, description: 'Project lifecycle not found.' })
  async updateLifecycle(
    @Param('id') id: string,
    @Body() body: Partial<ProjectLifecycleDto>,
  ) {
    return await this.projectsService.updateProjectLifecycle(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('lifecycle/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a project lifecycle' })
  @ApiResponse({ status: 200, description: 'Project lifecycle successfully deleted.', type: ProjectLifecycleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  @ApiResponse({ status: 404, description: 'Project lifecycle not found.' })
  async deleteLifecycle(@Param('id') id: string) {
    return await this.projectsService.deleteProjectLifecycle(id);
  }

  // TECHNICAL IMAGERY
  @Get('technical-imagery')
  @ApiOperation({ summary: 'Retrieve technical imageries' })
  @ApiResponse({ status: 200, description: 'Technical imageries successfully retrieved.', type: [TechnicalImageryDto] })
  async getTechnicalImageryList() {
    return await this.projectsService.getTechnicalImageries();
  }

  @UseGuards(JwtGuard)
  @Post('technical-imagery')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upsert technical imagery' })
  @ApiResponse({ status: 201, description: 'Technical imagery successfully upserted.', type: TechnicalImageryDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  async upsertTechnicalImagery(@Body() body: TechnicalImageryDto) {
    // Upsert expects projectId to match
    const { projectId, ...data } = body;
    return await this.projectsService.upsertTechnicalImagery(projectId, data);
  }

  @UseGuards(JwtGuard)
  @Delete('technical-imagery/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete technical imagery' })
  @ApiResponse({ status: 200, description: 'Technical imagery successfully deleted.', type: TechnicalImageryDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  @ApiResponse({ status: 404, description: 'Technical imagery not found.' })
  async deleteTechnicalImagery(@Param('id') id: string) {
    return await this.projectsService.deleteTechnicalImagery(id);
  }

  @UseGuards(JwtGuard)
  @Patch('technical-imagery/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update technical imagery' })
  @ApiResponse({ status: 200, description: 'Technical imagery successfully updated.', type: TechnicalImageryDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  @ApiResponse({ status: 404, description: 'Technical imagery not found.' })
  async updateTechnicalImagery(
    @Param('id') id: string,
    @Body() body: Partial<TechnicalImageryDto>,
  ) {
    return await this.projectsService.updateTechnicalImagery(id, body);
  }

  // PROJECT DATABASE SCHEMA
  @Get('database-schema')
  @ApiOperation({ summary: 'Retrieve project database schemas' })
  @ApiResponse({ status: 200, description: 'Database schemas successfully retrieved.', type: [ProjectDatabaseSchemaDto] })
  async getDatabaseSchemaList() {
    return await this.projectsService.getProjectDatabaseSchemas();
  }

  @UseGuards(JwtGuard)
  @Post('database-schema')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a project database schema' })
  @ApiResponse({ status: 201, description: 'Database schema successfully created.', type: ProjectDatabaseSchemaDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  async createDatabaseSchema(@Body() body: ProjectDatabaseSchemaDto) {
    return await this.projectsService.createProjectDatabaseSchema(body);
  }

  @UseGuards(JwtGuard)
  @Patch('database-schema/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing database schema' })
  @ApiResponse({ status: 200, description: 'Database schema successfully updated.', type: ProjectDatabaseSchemaDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  @ApiResponse({ status: 404, description: 'Database schema not found.' })
  async updateDatabaseSchema(
    @Param('id') id: string,
    @Body() body: Partial<ProjectDatabaseSchemaDto>,
  ) {
    return await this.projectsService.updateProjectDatabaseSchema(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('database-schema/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a database schema' })
  @ApiResponse({ status: 200, description: 'Database schema successfully deleted.', type: ProjectDatabaseSchemaDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  @ApiResponse({ status: 404, description: 'Database schema not found.' })
  async deleteDatabaseSchema(@Param('id') id: string) {
    return await this.projectsService.deleteProjectDatabaseSchema(id);
  }

  // PROJECT ERD
  @Get('erd')
  @ApiOperation({ summary: 'Retrieve project ERDs' })
  @ApiResponse({ status: 200, description: 'Project ERDs successfully retrieved.', type: [ProjectErdDto] })
  async getErdList() {
    return await this.projectsService.getProjectErds();
  }

  @UseGuards(JwtGuard)
  @Post('erd')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a project ERD' })
  @ApiResponse({ status: 201, description: 'Project ERD successfully created.', type: ProjectErdDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  async createErd(@Body() body: ProjectErdDto) {
    return await this.projectsService.createProjectErd(body);
  }

  @UseGuards(JwtGuard)
  @Patch('erd/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing project ERD' })
  @ApiResponse({ status: 200, description: 'Project ERD successfully updated.', type: ProjectErdDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  @ApiResponse({ status: 404, description: 'Project ERD not found.' })
  async updateErd(
    @Param('id') id: string,
    @Body() body: Partial<ProjectErdDto>,
  ) {
    return await this.projectsService.updateProjectErd(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('erd/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a project ERD' })
  @ApiResponse({ status: 200, description: 'Project ERD successfully deleted.', type: ProjectErdDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' , schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } }})
  @ApiResponse({ status: 404, description: 'Project ERD not found.' })
  async deleteErd(@Param('id') id: string) {
    return await this.projectsService.deleteProjectErd(id);
  }
}

