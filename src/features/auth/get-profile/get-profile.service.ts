import { Injectable } from '@nestjs/common';

@Injectable()
export class GetProfileService {
  execute(user: any) {
    return {
      message: 'Selamat datang di ruangan rahasia',
      user: user,
    };
  }
}
