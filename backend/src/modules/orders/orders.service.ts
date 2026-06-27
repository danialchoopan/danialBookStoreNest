import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            book: {
              select: { id: true, price: true, stock: true, sellerId: true, title: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('سبد خرید خالی است');
    }

    for (const item of cart.items) {
      if (item.book.stock < item.quantity) {
        throw new BadRequestException(`موجودی کتاب "${item.book.title}" کافی نیست`);
      }
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.book.price) * item.quantity,
      0,
    );

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          shippingAddress: dto.shippingAddress as any,
          note: dto.note,
          items: {
            create: cart.items.map((item) => ({
              bookId: item.bookId,
              sellerId: item.book.sellerId,
              quantity: item.quantity,
              unitPrice: item.book.price,
              totalPrice: Number(item.book.price) * item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of cart.items) {
        await tx.book.update({
          where: { id: item.bookId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return order;
  }

  async findAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              book: { select: { title: true, images: true } },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            book: { select: { title: true, author: true, images: true } },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('سفارش یافت نشد');
    }

    return order;
  }

  async cancel(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('سفارش یافت نشد');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException('فقط سفارشات در انتظار پرداخت قابل لغو هستند');
    }

    return this.prisma.$transaction(async (tx) => {
      const items = await tx.orderItem.findMany({ where: { orderId } });

      for (const item of items) {
        await tx.book.update({
          where: { id: item.bookId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });
    });
  }
}
