import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from './login.dto';
import { LoginService } from './login.service';

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
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and receive a JWT Token' })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.loginService.execute(dto);
  }
}
