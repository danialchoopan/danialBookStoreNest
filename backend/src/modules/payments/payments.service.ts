import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async topUpWallet(userId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('مبلغ باید بیشتر از صفر باشد');
    }

    if (amount > 50000000) {
      throw new BadRequestException('حداکثر مبلغ شارژ ۵۰ میلیون تومان است');
    }

    const sellerProfile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!sellerProfile) {
      throw new NotFoundException('پروفایل فروشنده یافت نشد');
    }

    const transaction = await this.prisma.$transaction(async (tx) => {
      const txn = await tx.walletTransaction.create({
        data: {
          sellerId: sellerProfile.id,
          amount,
          type: 'CREDIT',
          description: `شارژ کیف پول به مبلغ ${new Intl.NumberFormat('fa-IR').format(amount)} تومان`,
        },
      });

      await tx.sellerProfile.update({
        where: { id: sellerProfile.id },
        data: { balance: { increment: amount } },
      });

      return txn;
    });

    return {
      transaction,
      newBalance: Number(sellerProfile.balance) + amount,
    };
  }

  async deductCommission(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            book: {
              include: { seller: { select: { commissionRate: true, id: true } } },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('سفارش یافت نشد');
    }

    if (order.status !== 'DELIVERED') {
      throw new BadRequestException('سفارش هنوز تحویل داده نشده است');
    }

    const sellerCommissions = new Map<string, number>();

    for (const item of order.items) {
      const sellerId = item.book.seller.id;
      const rate = Number(item.book.seller.commissionRate);
      const commission = Number(item.totalPrice) * (rate / 100);

      const current = sellerCommissions.get(sellerId) || 0;
      sellerCommissions.set(sellerId, current + commission);
    }

    const results = [];

    for (const [sellerId, commission] of sellerCommissions) {
      const result = await this.prisma.$transaction(async (tx) => {
        const txn = await tx.walletTransaction.create({
          data: {
            sellerId,
            amount: -commission,
            type: 'DEBIT',
            description: `کمیسیون سفارش ${orderId.slice(0, 8)}`,
          },
        });

        await tx.sellerProfile.update({
          where: { id: sellerId },
          data: { balance: { decrement: commission } },
        });

        return txn;
      });

      results.push(result);
    }

    return results;
  }

  async getWalletSummary(userId: string) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('پروفایل فروشنده یافت نشد');
    }

    const [totalCredit, totalDebit, transactionCount] = await Promise.all([
      this.prisma.walletTransaction.aggregate({
        where: { sellerId: profile.id, type: 'CREDIT' },
        _sum: { amount: true },
      }),
      this.prisma.walletTransaction.aggregate({
        where: { sellerId: profile.id, type: 'DEBIT' },
        _sum: { amount: true },
      }),
      this.prisma.walletTransaction.count({ where: { sellerId: profile.id } }),
    ]);

    return {
      balance: profile.balance,
      totalCredit: totalCredit._sum.amount || 0,
      totalDebit: totalDebit._sum.amount || 0,
      transactionCount,
    };
  }
}
