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
import { SkillsService } from './skills.service';
import {
  ProficiencyDto,
  SkillDto,
  RoadmapDto,
  LearningResponseDto,
} from './skills.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Skills')
@ApiResponse({
  status: 400,
  description: 'Bad Request',
  schema: {
    example: {
      statusCode: 400,
      message: ['Validation failed'],
      error: 'Bad Request',
    },
  },
})
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
  schema: {
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized',
    },
  },
})
@ApiResponse({
  status: 403,
  description: 'Forbidden',
  schema: {
    example: {
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
    },
  },
})
@ApiResponse({
  status: 404,
  description: 'Not Found',
  schema: {
    example: {
      statusCode: 404,
      message: 'Resource not found',
      error: 'Not Found',
    },
  },
})
@ApiResponse({
  status: 429,
  description: 'Too Many Requests',
  schema: {
    example: {
      statusCode: 429,
      message: 'Too many requests, please try again later.',
      error: 'Too Many Requests',
    },
  },
})
@ApiResponse({
  status: 500,
  description: 'Internal Server Error',
  schema: { example: { statusCode: 500, message: 'Internal server error' } },
})
@Controller()
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  // PROFICIENCY
  @Get('proficiency')
  @ApiOperation({ summary: 'Retrieve all proficiencies' })
  @ApiResponse({
    status: 200,
    description: 'List of proficiencies successfully retrieved.',
    type: [ProficiencyDto],
  })
  async getProficiency() {
    return await this.skillsService.getProficiencies();
  }

  @UseGuards(JwtGuard)
  @Post('proficiency')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new proficiency' })
  @ApiResponse({
    status: 201,
    description: 'Proficiency successfully created.',
    type: ProficiencyDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  async createProficiency(@Body() body: ProficiencyDto) {
    return await this.skillsService.createProficiency(body);
  }

  @UseGuards(JwtGuard)
  @Patch('proficiency/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing proficiency' })
  @ApiResponse({
    status: 200,
    description: 'Proficiency successfully updated.',
    type: ProficiencyDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Proficiency not found.' })
  async updateProficiency(
    @Param('id') id: string,
    @Body() body: Partial<ProficiencyDto>,
  ) {
    return await this.skillsService.updateProficiency(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('proficiency/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a proficiency' })
  @ApiResponse({
    status: 200,
    description: 'Proficiency successfully deleted.',
    type: ProficiencyDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Proficiency not found.' })
  async deleteProficiency(@Param('id') id: string) {
    return await this.skillsService.deleteProficiency(id);
  }

  // SKILLS
  @Get('skills')
  @ApiOperation({ summary: 'Retrieve all skills' })
  @ApiResponse({
    status: 200,
    description: 'List of skills successfully retrieved.',
    type: [SkillDto],
  })
  async getSkills() {
    return await this.skillsService.getSkills();
  }

  @UseGuards(JwtGuard)
  @Post('skills')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({
    status: 201,
    description: 'Skill successfully created.',
    type: SkillDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  async createSkill(@Body() body: SkillDto) {
    return await this.skillsService.createSkill(body);
  }

  @UseGuards(JwtGuard)
  @Patch('skills/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing skill' })
  @ApiResponse({
    status: 200,
    description: 'Skill successfully updated.',
    type: SkillDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Skill not found.' })
  async updateSkill(@Param('id') id: string, @Body() body: Partial<SkillDto>) {
    return await this.skillsService.updateSkill(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('skills/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a skill' })
  @ApiResponse({
    status: 200,
    description: 'Skill successfully deleted.',
    type: SkillDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Skill not found.' })
  async deleteSkill(@Param('id') id: string) {
    return await this.skillsService.deleteSkill(id);
  }

  // LEARNING (roadmap)
  @Get('learning')
  @ApiOperation({ summary: 'Retrieve learning roadmap' })
  @ApiResponse({
    status: 200,
    description: 'Learning roadmap successfully retrieved.',
    type: LearningResponseDto,
  })
  async getLearning() {
    const roadmap = await this.skillsService.getRoadmaps();
    return { roadmap };
  }

  @UseGuards(JwtGuard)
  @Post('learning')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a roadmap entry' })
  @ApiResponse({
    status: 201,
    description: 'Roadmap entry successfully created.',
    type: RoadmapDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  async createLearning(@Body() body: RoadmapDto) {
    return await this.skillsService.createRoadmap(body);
  }

  @UseGuards(JwtGuard)
  @Patch('learning/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing roadmap entry' })
  @ApiResponse({
    status: 200,
    description: 'Roadmap entry successfully updated.',
    type: RoadmapDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Roadmap entry not found.' })
  async updateLearning(
    @Param('id') id: string,
    @Body() body: Partial<RoadmapDto>,
  ) {
    return await this.skillsService.updateRoadmap(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('learning/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a roadmap entry' })
  @ApiResponse({
    status: 200,
    description: 'Roadmap entry successfully deleted.',
    type: RoadmapDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Roadmap entry not found.' })
  async deleteLearning(@Param('id') id: string) {
    return await this.skillsService.deleteRoadmap(id);
  }
}
