import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';
import { GetProfileService } from './get-profile.service';

@ApiTags('Auth')
@Controller('auth')
export class GetProfileController {
  constructor(private readonly getProfileService: GetProfileService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mendapatkan data diri user yang sedang login' })
  @ApiResponse({ status: 200, description: 'Data user berhasil diambil' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req: Request) {
    return this.getProfileService.execute(req.user);
  }
}
