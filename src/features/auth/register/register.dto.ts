import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email user' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Nama lengkap' })
  @IsString()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  name: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password minimal 8 karakter',
  })
  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;
}
