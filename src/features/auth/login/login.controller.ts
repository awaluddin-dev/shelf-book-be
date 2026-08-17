import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from './login.dto';
import { LoginService } from './login.service';

@ApiTags('Auth')
@ApiGlobalResponses()
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
