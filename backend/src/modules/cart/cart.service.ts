import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                images: true,
                stock: true,
                seller: { select: { shopName: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              book: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  price: true,
                  images: true,
                  stock: true,
                  seller: { select: { shopName: true } },
                },
              },
            },
          },
        },
      });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.book.price) * item.quantity,
      0,
    );

    return { ...cart, totalAmount, itemCount: cart.items.length };
  }

  async addItem(userId: string, bookId: string, quantity = 1) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      throw new NotFoundException('کتاب یافت نشد');
    }

    if (book.stock < quantity) {
      throw new BadRequestException('موجودی کتاب کافی نیست');
    }

    const cart = await this.prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const existingItem = await this.prisma.cartItem.findUnique({
      where: { cartId_bookId: { cartId: cart.id, bookId } },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > book.stock) {
        throw new BadRequestException('موجودی کتاب کافی نیست');
      }
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId: cart.id, bookId, quantity },
      });
    }

    return this.getCart(userId);
  }

  async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    if (quantity < 1) {
      throw new BadRequestException('تعداد باید حداقل ۱ باشد');
    }

    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      throw new NotFoundException('سبد خرید یافت نشد');
    }

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { book: true },
    });

    if (!item) {
      throw new NotFoundException('آیتم سبد خرید یافت نشد');
    }

    if (quantity > item.book.stock) {
      throw new BadRequestException('موجودی کتاب کافی نیست');
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      throw new NotFoundException('سبد خرید یافت نشد');
    }

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      throw new NotFoundException('آیتم سبد خرید یافت نشد');
    }

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return { message: 'سبد خرید خالی شد' };
  }
}
