import { Injectable, BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransferDto } from './transfer.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransferService {
  constructor(private prisma: PrismaService) {}

  async execute(senderId: string, dto: TransferDto) {
    const [sender, receiver] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: senderId },
        include: { wallet: true },
      }),
      this.prisma.user.findUnique({
        where: { email: dto.targetEmail },
        include: { wallet: true },
      }),
    ]);

    if (!sender) {
      throw new NotFoundException('Pengirim tidak ditemukan');
    }

    if (!receiver) {
      throw new NotFoundException('Penerima tidak ditemukan');
    }

    if (sender.id === receiver.id) {
      throw new BadRequestException('Tidak bisa transfer ke diri sendiri');
    }

    if (Number(sender.wallet?.balance) < dto.amount) {
      throw new BadRequestException('Saldo tidak cukup');
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const updateSenderWallet = await tx.wallet.update({
          where: { id: sender.wallet?.id, version: sender.wallet?.version },
          data: {
            balance: { decrement: dto.amount },
            version: { increment: 1 },
          },
        });

        await tx.wallet.update({
          where: {
            id: receiver.wallet!.id,
            version: receiver.wallet!.version, // Kunci OCC
          },
          data: {
            balance: { increment: dto.amount },
            version: { increment: 1 },
          },
        });
        
        await tx.transaction.create({
          data: {
            amount: dto.amount,
            type: 'CREDIT',
            walletId: sender.wallet!.id,
          },
        });

        // D. Catat Histori Penerima (Uang Masuk)
        await tx.transaction.create({
          data: {
            amount: dto.amount,
            type: 'DEBIT',
            walletId: receiver.wallet!.id,
          },
        });

        return updateSenderWallet;
      });

      return {
        message: `Berhasil transfer Rp ${dto.amount} ke ${receiver.name}`,
        sisaSaldo: result.balance,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new ConflictException(
          'Sistem sibuk (Race Condition dicegah). Silakan coba lagi.',
        );
      }
      console.error('❌ ERROR TRANSFER:', error);
      throw new InternalServerErrorException('Gagal memproses transfer');
    }
  }
}
