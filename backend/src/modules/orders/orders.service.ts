import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            book: {
              select: { id: true, price: true, stock: true, sellerId: true, title: true, format: true, ebookPrice: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('سبد خرید خالی است');
    }

    // Check stock only for physical items
    for (const item of cart.items) {
      if (item.book.format !== 'DIGITAL' && item.book.stock != null && item.book.stock < item.quantity) {
        throw new BadRequestException(`موجودی کتاب "${item.book.title}" کافی نیست`);
      }
    }

    // Check if all items are digital (shipping not needed)
    const allDigital = cart.items.every((item) => item.book.format === 'DIGITAL');
    if (!allDigital && !dto.shippingAddress) {
      throw new BadRequestException('آدرس ارسال برای کتاب‌های فیزیکی الزامی است');
    }

    // Use ebookPrice for digital items
    const totalAmount = cart.items.reduce((sum, item) => {
      const unitPrice = item.book.format === 'DIGITAL' && item.book.ebookPrice
        ? Number(item.book.ebookPrice)
        : Number(item.book.price);
      return sum + unitPrice * item.quantity;
    }, 0);

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          shippingAddress: dto.shippingAddress ? JSON.stringify(dto.shippingAddress) : null,
          note: dto.note,
          items: {
            create: cart.items.map((item) => {
              const unitPrice = item.book.format === 'DIGITAL' && item.book.ebookPrice
                ? Number(item.book.ebookPrice)
                : Number(item.book.price);
              return {
                bookId: item.bookId,
                sellerId: item.book.sellerId,
                quantity: item.quantity,
                unitPrice,
                totalPrice: unitPrice * item.quantity,
              };
            }),
          },
        },
        include: { items: true },
      });

      await tx.orderStatusHistory.create({
        data: { orderId: newOrder.id, status: 'PENDING', note: 'سفارش ثبت شد' },
      });

      // Decrement stock only for physical items
      for (const item of cart.items) {
        if (item.book.format !== 'DIGITAL') {
          await tx.book.update({
            where: { id: item.bookId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      // Create ebook purchase records for digital items
      for (const item of cart.items) {
        if (item.book.format === 'DIGITAL' || item.book.format === 'BOTH') {
          await tx.ebookPurchase.upsert({
            where: { userId_bookId: { userId, bookId: item.bookId } },
            create: { userId, orderId: newOrder.id, bookId: item.bookId },
            update: { orderId: newOrder.id },
          });
        }
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return newOrder;
    });

    // Send confirmation email
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const items = await Promise.all(
          order.items.map(async (item) => {
            const book = await this.prisma.book.findUnique({ where: { id: item.bookId } });
            return { title: book?.title || 'کتاب', quantity: item.quantity, price: Number(item.totalPrice) };
          }),
        );
        await this.emailService.sendOrderConfirmation({
          id: order.id, email: user.email, firstName: user.firstName,
          items, totalAmount: Number(order.totalAmount),
        });
      }
    } catch {
      // Don't fail order if email fails
    }

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
