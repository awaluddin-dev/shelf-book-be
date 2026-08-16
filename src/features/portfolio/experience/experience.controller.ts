import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { RateLimitService } from 'src/common/services/rate-limit.service';
import { ExperienceService } from './experience.service';
import {
  TestimonialDto,
  WorkExperienceDto,
  CurrentFocusDto,
} from './experience.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Experience')
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
export class ExperienceController {
  constructor(
    private readonly experienceService: ExperienceService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  // TESTIMONIALS (rate-limited for public submission)
  @Get('testimonials')
  @ApiOperation({ summary: 'Retrieve all testimonials' })
  @ApiResponse({
    status: 200,
    description: 'List of testimonials successfully retrieved.',
    type: [TestimonialDto],
  })
  async getTestimonials() {
    return await this.experienceService.getTestimonials();
  }

  @Post('testimonials')
  @ApiOperation({ summary: 'Create a new testimonial' })
  @ApiResponse({
    status: 201,
    description: 'Testimonial successfully created.',
    type: TestimonialDto,
  })
  @ApiResponse({ status: 429, description: 'Too many requests.' })
  async createTestimonial(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() body: TestimonialDto,
  ) {
    await this.rateLimitService.checkLimit(req);
    const result = await this.experienceService.createTestimonial(body);
    await this.rateLimitService.setLimit(req, res);
    return result;
  }

  @UseGuards(JwtGuard)
  @Patch('testimonials/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing testimonial' })
  @ApiResponse({
    status: 200,
    description: 'Testimonial successfully updated.',
    type: TestimonialDto,
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
  @ApiResponse({ status: 404, description: 'Testimonial not found.' })
  async updateTestimonial(
    @Param('id') id: string,
    @Body() body: Partial<TestimonialDto>,
  ) {
    return await this.experienceService.updateTestimonial(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('testimonials/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a testimonial' })
  @ApiResponse({
    status: 200,
    description: 'Testimonial successfully deleted.',
    type: TestimonialDto,
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
  @ApiResponse({ status: 404, description: 'Testimonial not found.' })
  async deleteTestimonial(@Param('id') id: string) {
    return await this.experienceService.deleteTestimonial(id);
  }

  // WORK (workExperience)
  @Get('work')
  @ApiOperation({ summary: 'Retrieve work experiences' })
  @ApiResponse({
    status: 200,
    description: 'Work experiences successfully retrieved.',
    type: [WorkExperienceDto],
  })
  async getWork() {
    return await this.experienceService.getWorkExperiences();
  }

  @UseGuards(JwtGuard)
  @Post('work')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new work experience' })
  @ApiResponse({
    status: 201,
    description: 'Work experience successfully created.',
    type: WorkExperienceDto,
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
  async createWork(@Body() body: WorkExperienceDto) {
    return await this.experienceService.createWorkExperience(body);
  }

  @UseGuards(JwtGuard)
  @Patch('work/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing work experience' })
  @ApiResponse({
    status: 200,
    description: 'Work experience successfully updated.',
    type: WorkExperienceDto,
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
  @ApiResponse({ status: 404, description: 'Work experience not found.' })
  async updateWork(
    @Param('id') id: string,
    @Body() body: Partial<WorkExperienceDto>,
  ) {
    return await this.experienceService.updateWorkExperience(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('work/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a work experience' })
  @ApiResponse({
    status: 200,
    description: 'Work experience successfully deleted.',
    type: WorkExperienceDto,
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
  @ApiResponse({ status: 404, description: 'Work experience not found.' })
  async deleteWork(@Param('id') id: string) {
    return await this.experienceService.deleteWorkExperience(id);
  }

  // CURRENT (currentFocus)
  @Get('current')
  @ApiOperation({ summary: 'Retrieve current foci' })
  @ApiResponse({
    status: 200,
    description: 'Current foci successfully retrieved.',
    type: [CurrentFocusDto],
  })
  async getCurrent() {
    return await this.experienceService.getCurrentFoci();
  }

  @UseGuards(JwtGuard)
  @Post('current')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new current focus' })
  @ApiResponse({
    status: 201,
    description: 'Current focus successfully created.',
    type: CurrentFocusDto,
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
  async createCurrent(@Body() body: CurrentFocusDto) {
    return await this.experienceService.createCurrentFocus(body);
  }

  @UseGuards(JwtGuard)
  @Patch('current/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing current focus' })
  @ApiResponse({
    status: 200,
    description: 'Current focus successfully updated.',
    type: CurrentFocusDto,
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
  @ApiResponse({ status: 404, description: 'Current focus not found.' })
  async updateCurrent(
    @Param('id') id: string,
    @Body() body: Partial<CurrentFocusDto>,
  ) {
    return await this.experienceService.updateCurrentFocus(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('current/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a current focus' })
  @ApiResponse({
    status: 200,
    description: 'Current focus successfully deleted.',
    type: CurrentFocusDto,
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
  @ApiResponse({ status: 404, description: 'Current focus not found.' })
  async deleteCurrent(@Param('id') id: string) {
    return await this.experienceService.deleteCurrentFocus(id);
  }
}
