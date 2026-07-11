import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TopUpDto } from './top-up.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TopUpService {
  constructor(private prisma: PrismaService) {}

  async execute(userId: string, dto: TopUpDto) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet tidak ditemukan');
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const updateWallet = await tx.wallet.update({
          where: { id: wallet.id, version: wallet.version },
          data: {
            balance: { increment: dto.amount },
            version: { increment: 1 },
          },
        });

        await tx.transaction.create({
          data: {
            amount: dto.amount,
            type: 'DEBIT',
            walletId: wallet.id,
          },
        });

        return updateWallet;
      });

      return {
        message: 'top up berhasil',
        newBalance: result.balance,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new ConflictException(
          'Sistem sedang sibuk memproses transaksi lain. Saldo aman. Silakan coba lagi.',
        );
      }

      console.error('ERROR TOPUP:', error);
      throw new InternalServerErrorException('Gagal memproses top up');
    }
  }
}
