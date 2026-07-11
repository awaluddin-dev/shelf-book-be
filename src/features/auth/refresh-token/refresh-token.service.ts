import { Injectable } from '@nestjs/common';
import { TokenService } from '../shared/token.service';
import { RefreshDto } from './refresh-token.dto';

@Injectable()
export class RefreshTokenService {
  constructor(private tokenService: TokenService) {}

  async execute(dto: RefreshDto) {
    const payload = await this.tokenService.verifyRefreshToken(dto.refreshToken);
    return this.tokenService.generateAndSaveTokens(payload.sub, payload.email);
  }
}
