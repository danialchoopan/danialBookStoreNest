import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSellerProfileDto } from './dto/seller.dto';

@Injectable()
export class SellerService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('پروفایل فروشنده یافت نشد');
    }

    return profile;
  }

  async createProfile(userId: string, dto: CreateSellerProfileDto) {
    const existing = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('پروفایل فروشنده قبلاً ایجاد شده است');
    }

    const slug = dto.shopName
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/^-|-$/g, '');

    return this.prisma.sellerProfile.create({
      data: {
        userId,
        shopName: dto.shopName,
        shopSlug: slug,
        description: dto.description,
      },
    });
  }

  async getDashboard(userId: string) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('پروفایل فروشنده یافت نشد');
    }

    const [totalBooks, totalOrders, totalRevenue, recentOrders, walletBalance] =
      await Promise.all([
        this.prisma.book.count({ where: { sellerId: profile.id } }),
        this.prisma.orderItem.count({ where: { sellerId: profile.id } }),
        this.prisma.orderItem.aggregate({
          where: { sellerId: profile.id, order: { status: 'DELIVERED' } },
          _sum: { totalPrice: true },
        }),
        this.prisma.orderItem.findMany({
          where: { sellerId: profile.id },
          include: {
            order: { select: { id: true, status: true, createdAt: true } },
            book: { select: { title: true } },
          },
          orderBy: { order: { createdAt: 'desc' } },
          take: 10,
        }),
        this.prisma.walletTransaction.aggregate({
          where: { sellerId: profile.id },
          _sum: { amount: true },
        }),
      ]);

    return {
      shopName: profile.shopName,
      isApproved: profile.isApproved,
      totalBooks,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      walletBalance: profile.balance,
      commissionRate: profile.commissionRate,
      recentOrders,
    };
  }

  async getMyBooks(userId: string, page = 1, limit = 20) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('پروفایل فروشنده یافت نشد');
    }

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where: { sellerId: profile.id },
        include: {
          categories: { include: { category: { select: { name: true } } } },
          _count: { select: { reviews: true, orderItems: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.book.count({ where: { sellerId: profile.id } }),
    ]);

    return {
      data: books,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getWallet(userId: string, page = 1, limit = 20) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('پروفایل فروشنده یافت نشد');
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({
        where: { sellerId: profile.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.walletTransaction.count({ where: { sellerId: profile.id } }),
    ]);

    return {
      data: transactions,
      balance: profile.balance,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOrders(userId: string, page = 1, limit = 20) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('پروفایل فروشنده یافت نشد');
    }

    const skip = (page - 1) * limit;

    const [orderItems, total] = await Promise.all([
      this.prisma.orderItem.findMany({
        where: { sellerId: profile.id },
        include: {
          order: {
            include: {
              user: { select: { firstName: true, lastName: true, phone: true } },
            },
          },
          book: { select: { title: true, images: true } },
        },
        skip,
        take: limit,
        orderBy: { order: { createdAt: 'desc' } },
      }),
      this.prisma.orderItem.count({ where: { sellerId: profile.id } }),
    ]);

    return {
      data: orderItems,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateOrderStatus(userId: string, orderId: string, status: string) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('پروفایل فروشنده یافت نشد');
    }

    const orderItem = await this.prisma.orderItem.findFirst({
      where: { orderId, sellerId: profile.id },
    });

    if (!orderItem) {
      throw new NotFoundException('این سفارش متعلق به شما نیست');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
    });
  }
}
