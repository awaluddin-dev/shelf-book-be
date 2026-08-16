import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto, RegisterResponseDto } from './register.dto';
import { RegisterService } from './register.service';

@ApiTags('Auth')
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
@Controller('auth')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: ['Validation failed'],
        error: 'Bad Request',
      },
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.registerService.execute(dto);
  }
}
