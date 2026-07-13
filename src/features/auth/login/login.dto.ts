import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  password: string;

  @ApiProperty({ example: '0.xyz...' })
  @IsString()
  @IsNotEmpty({ message: 'Turnstile token tidak boleh kosong' })
  turnstileToken: string;
}
