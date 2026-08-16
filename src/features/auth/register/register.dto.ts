import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'The email address of the new user', example: 'user@example.com' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email: string;

  @ApiProperty({ description: 'The full name of the new user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  name: string;

  @ApiProperty({ description: 'The password for the new user, minimum 8 characters', example: 'password123' })
  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;
}

export class RegisterResponseDto {
  @ApiProperty({ description: 'The unique identifier of the registered user', example: 'cuid12345' })
  id: string;

  @ApiProperty({ description: 'The full name of the registered user', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'The email address of the registered user', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'The date and time when the user was created', example: '2023-10-25T12:00:00Z' })
  createdAt: Date;
}
