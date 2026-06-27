import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [totalUsers, totalSellers, totalBooks, totalOrders, totalRevenue, pendingSellers] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.sellerProfile.count(),
        this.prisma.book.count(),
        this.prisma.order.count(),
        this.prisma.order.aggregate({
          where: { status: 'DELIVERED' },
          _sum: { totalAmount: true },
        }),
        this.prisma.sellerProfile.count({ where: { isApproved: false } }),
      ]);

    return {
      totalUsers,
      totalSellers,
      totalBooks,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingSellers,
    };
  }

  async getAllSellers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [sellers, total] = await Promise.all([
      this.prisma.sellerProfile.findMany({
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          _count: { select: { books: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.sellerProfile.count(),
    ]);

    return {
      data: sellers,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async approveSeller(sellerId: string) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException('فروشنده یافت نشد');
    }

    return this.prisma.sellerProfile.update({
      where: { id: sellerId },
      data: { isApproved: true },
    });
  }

  async rejectSeller(sellerId: string) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException('فروشنده یافت نشد');
    }

    return this.prisma.sellerProfile.update({
      where: { id: sellerId },
      data: { isApproved: false },
    });
  }

  async updateCommission(sellerId: string, rate: number) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException('فروشنده یافت نشد');
    }

    return this.prisma.sellerProfile.update({
      where: { id: sellerId },
      data: { commissionRate: rate },
    });
  }

  async getAllOrders(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: {
            include: {
              book: { select: { title: true } },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count(),
    ]);

    return {
      data: orders,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getAllReviews(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        include: {
          user: { select: { firstName: true, lastName: true } },
          book: { select: { title: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count(),
    ]);

    return {
      data: reviews,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async deleteReview(reviewId: string) {
    await this.prisma.review.delete({ where: { id: reviewId } });
    return { message: 'نظر با موفقیت حذف شد' };
  }
}
