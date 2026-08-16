import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshDto, RefreshResponseDto } from './refresh-token.dto';
import { RefreshTokenService } from './refresh-token.service';

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
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh an expired access token using a refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token successfully refreshed',
    type: RefreshResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or invalid refresh token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: RefreshDto) {
    return this.refreshTokenService.execute(dto);
  }
}
