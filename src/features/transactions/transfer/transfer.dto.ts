import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class TransferDto {
  @ApiProperty({ example: 'target@example.com', description: 'Email penerima' })
  @IsEmail({}, { message: 'Format email penerima salah' })
  @IsNotEmpty()
  targetEmail: string;

  @ApiProperty({ example: 25000, description: 'Nominal transfer' })
  @IsNumber({}, { message: 'Nominal harus berupa angka' })
  @IsPositive({ message: 'Nominal harus positif' })
  @Min(10000, { message: 'Minimal transfer adalah Rp 10.000' })
  amount: number;
}
