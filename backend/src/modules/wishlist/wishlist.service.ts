import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        book: {
          include: {
            seller: { select: { shopName: true } },
            reviews: { select: { rating: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addToWishlist(userId: string, bookId: string) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException('کتاب یافت نشد');
    }

    const existing = await this.prisma.wishlist.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });

    if (existing) {
      throw new ConflictException('این کتاب قبلاً به علاقه‌مندی‌ها اضافه شده');
    }

    return this.prisma.wishlist.create({
      data: { userId, bookId },
      include: {
        book: { select: { id: true, title: true, price: true } },
      },
    });
  }

  async removeFromWishlist(userId: string, bookId: string) {
    const item = await this.prisma.wishlist.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });

    if (!item) {
      throw new NotFoundException('این کتاب در علاقه‌مندی‌ها نیست');
    }

    await this.prisma.wishlist.delete({
      where: { userId_bookId: { userId, bookId } },
    });

    return { message: 'از علاقه‌مندی‌ها حذف شد' };
  }

  async isInWishlist(userId: string, bookId: string): Promise<boolean> {
    const item = await this.prisma.wishlist.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });
    return !!item;
  }

  async toggleWishlist(userId: string, bookId: string) {
    const existing = await this.prisma.wishlist.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });

    if (existing) {
      await this.prisma.wishlist.delete({
        where: { userId_bookId: { userId, bookId } },
      });
      return { added: false, message: 'از علاقه‌مندی‌ها حذف شد' };
    }

    await this.prisma.wishlist.create({
      data: { userId, bookId },
    });
    return { added: true, message: 'به علاقه‌مندی‌ها اضافه شد' };
  }
}
