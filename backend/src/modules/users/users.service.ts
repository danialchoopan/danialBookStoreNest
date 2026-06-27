import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    return user;
  }

  async toggleActive(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: { id: true, email: true, firstName: true, lastName: true, isActive: true },
    });
  }

  async changeRole(id: string, role: Role) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
  }

  async getSellerStats(sellerId: string) {
    const sellerProfile = await this.prisma.sellerProfile.findFirst({
      where: { userId: sellerId },
    });

    if (!sellerProfile) {
      throw new NotFoundException('پروفایل فروشنده یافت نشد');
    }

    const [totalBooks, totalOrders, totalRevenue] = await Promise.all([
      this.prisma.book.count({ where: { sellerId: sellerProfile.id } }),
      this.prisma.orderItem.count({ where: { sellerId: sellerProfile.id } }),
      this.prisma.orderItem.aggregate({
        where: { sellerId: sellerProfile.id, order: { status: 'DELIVERED' } },
        _sum: { totalPrice: true },
      }),
    ]);

    return {
      totalBooks,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      balance: sellerProfile.balance,
      commissionRate: sellerProfile.commissionRate,
    };
  }
}
