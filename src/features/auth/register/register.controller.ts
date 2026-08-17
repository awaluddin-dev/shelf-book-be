import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto, RegisterResponseDto } from './register.dto';
import { RegisterService } from './register.service';

@ApiTags('Auth')
@ApiGlobalResponses()
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
