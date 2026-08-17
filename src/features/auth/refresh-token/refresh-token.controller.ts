import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshDto, RefreshResponseDto } from './refresh-token.dto';
import { RefreshTokenService } from './refresh-token.service';

@ApiTags('Auth')
@ApiGlobalResponses()
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
