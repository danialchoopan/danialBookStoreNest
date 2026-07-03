import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const STATUS_FLOW: Record<string, string[]> = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: [],
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'در انتظار پرداخت',
  PAID: 'پرداخت شده',
  PROCESSING: 'در حال پردازش',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل شده',
  CANCELLED: 'لغو شده',
  REFUNDED: 'بازپرداخت شده',
};

@Injectable()
export class OrderTrackingService {
  constructor(private prisma: PrismaService) {}

  async getOrderWithTracking(orderId: string, userId?: string) {
    const where: any = { id: orderId };
    if (userId) where.userId = userId;

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            book: { select: { title: true, author: true, images: true } },
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('سفارش یافت نشد');
    }

    const progress = this.calculateProgress(order.status);

    return {
      ...order,
      statusLabel: STATUS_LABELS[order.status],
      progress,
      nextStatuses: STATUS_FLOW[order.status] || [],
    };
  }

  async updateOrderStatus(orderId: string, newStatus: string, note?: string, sellerId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('سفارش یافت نشد');
    }

    // If seller, verify they own an item in this order
    if (sellerId) {
      const hasItem = order.items.some((item) => item.sellerId === sellerId);
      if (!hasItem) {
        throw new ForbiddenException('این سفارش متعلق به شما نیست');
      }
    }

    const allowedNext = STATUS_FLOW[order.status] || [];
    if (!allowedNext.includes(newStatus)) {
      throw new BadRequestException(`تغییر وضعیت از ${STATUS_LABELS[order.status]} به ${STATUS_LABELS[newStatus]} مجاز نیست`);
    }

    // If cancelling, restore stock
    if (newStatus === 'CANCELLED') {
      for (const item of order.items) {
        await this.prisma.book.update({
          where: { id: item.bookId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: newStatus,
          note: note || `تغییر وضعیت به ${STATUS_LABELS[newStatus]}`,
        },
      });

      return updatedOrder;
    });

    return {
      ...updated,
      statusLabel: STATUS_LABELS[updated.status],
      message: `وضعیت سفارش به "${STATUS_LABELS[newStatus]}" تغییر کرد`,
    };
  }

  private calculateProgress(status: string): number {
    const progressMap: Record<string, number> = {
      PENDING: 0,
      PAID: 20,
      PROCESSING: 40,
      SHIPPED: 70,
      DELIVERED: 100,
      CANCELLED: 100,
      REFUNDED: 100,
    };
    return progressMap[status] || 0;
  }

  async getSellerOrders(sellerId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          items: { some: { sellerId } },
        },
        include: {
          items: {
            where: { sellerId },
            include: {
              book: { select: { title: true, images: true } },
            },
          },
          user: { select: { firstName: true, lastName: true } },
          statusHistory: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({
        where: { items: { some: { sellerId } } },
      }),
    ]);

    return {
      data: orders.map((order) => ({
        ...order,
        statusLabel: STATUS_LABELS[order.status],
        lastUpdate: order.statusHistory[0]?.createdAt || order.createdAt,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}

import { ForbiddenException } from '@nestjs/common';
