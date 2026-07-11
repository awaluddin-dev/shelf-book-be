import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GetHistoryService {
  constructor(private prisma: PrismaService) {}

  async execute(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      select: { id: true }, 
    });

    if (!wallet) {
      throw new NotFoundException('Dompet tidak ditemukan');
    }

    const transactions = await this.prisma.transaction.findMany({
      where: {
        walletId: wallet.id,
      },
      orderBy: {
        createdAt: 'desc', 
      },
      take: 20, 
      select: {
        id: true,
        amount: true,
        type: true,
        createdAt: true,
      },
    });

    return {
      message: 'Berhasil mengambil riwayat transaksi',
      data: transactions,
    };
  }
}
