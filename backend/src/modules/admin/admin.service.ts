import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async getAnalytics(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      monthlyRevenue,
      statusBreakdown,
      topBooks,
      topSellers,
      newUsersPerMonth,
      todayOrders,
      todayRevenue,
      todayNewUsers,
      totalRevenueAll,
      totalUsers,
      totalSellers,
      totalBooks,
    ] = await Promise.all([
      // Revenue by month (last 12 months)
      this.prisma.$queryRaw`
        SELECT strftime('%Y-%m', createdAt) as month,
               SUM(totalAmount) as revenue,
               COUNT(*) as orders
        FROM "Order"
        WHERE createdAt >= date('now', '-12 months')
        GROUP BY strftime('%Y-%m', createdAt)
        ORDER BY month ASC
      `,

      // Orders by status
      this.prisma.order.groupBy({
        by: ['status'],
        where: { createdAt: { gte: since } },
        _count: true,
      }),

      // Top 10 books by revenue
      this.prisma.orderItem.groupBy({
        by: ['bookId'],
        where: { order: { createdAt: { gte: since } } },
        _sum: { quantity: true, totalPrice: true },
        orderBy: { _sum: { totalPrice: 'desc' } },
        take: 10,
      }),

      // Top sellers by revenue
      this.prisma.orderItem.groupBy({
        by: ['sellerId'],
        where: { order: { createdAt: { gte: since } } },
        _sum: { totalPrice: true },
        _count: true,
        orderBy: { _sum: { totalPrice: 'desc' } },
        take: 10,
      }),

      // New users per month
      this.prisma.$queryRaw`
        SELECT strftime('%Y-%m', createdAt) as month, COUNT(*) as count
        FROM "User"
        WHERE createdAt >= date('now', '-12 months')
        GROUP BY strftime('%Y-%m', createdAt)
        ORDER BY month ASC
      `,

      // Today's stats
      this.prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.order.aggregate({
        where: { createdAt: { gte: todayStart }, status: 'DELIVERED' },
        _sum: { totalAmount: true },
      }),
      this.prisma.user.count({ where: { createdAt: { gte: todayStart } } }),

      // Overall totals
      this.prisma.order.aggregate({ _sum: { totalAmount: true } }),
      this.prisma.user.count(),
      this.prisma.sellerProfile.count(),
      this.prisma.book.count(),
    ]);

    // Resolve book and seller names
    const bookIds = topBooks.map((b: any) => b.bookId);
    const sellerIds = topSellers.map((s: any) => s.sellerId);

    const [books, sellers] = await Promise.all([
      this.prisma.book.findMany({ where: { id: { in: bookIds } }, select: { id: true, title: true, price: true } }),
      this.prisma.sellerProfile.findMany({ where: { id: { in: sellerIds } }, select: { id: true, shopName: true } }),
    ]);

    return {
      today: {
        orders: todayOrders,
        revenue: todayRevenue._sum.totalAmount || 0,
        newUsers: todayNewUsers,
      },
      totals: {
        revenue: totalRevenueAll._sum.totalAmount || 0,
        users: totalUsers,
        sellers: totalSellers,
        books: totalBooks,
      },
      monthlyRevenue: (monthlyRevenue as any[]).map((r) => ({
        month: r.month,
        revenue: r.revenue || 0,
        orders: r.orders || 0,
      })),
      statusBreakdown: statusBreakdown.map((s) => ({
        status: s.status,
        count: s._count,
      })),
      topBooks: topBooks.map((b: any) => ({
        id: b.bookId,
        title: books.find((bk) => bk.id === b.bookId)?.title || 'نامشخص',
        totalSold: b._sum.quantity,
        totalRevenue: b._sum.totalPrice,
      })),
      topSellers: topSellers.map((s: any) => ({
        id: s.sellerId,
        shopName: sellers.find((sl) => sl.id === s.sellerId)?.shopName || 'نامشخص',
        totalRevenue: s._sum.totalPrice,
        orderCount: s._count,
      })),
      newUsersPerMonth: (newUsersPerMonth as any[]).map((r) => ({
        month: r.month,
        count: r.count || 0,
      })),
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
    const seller = await this.prisma.sellerProfile.findUnique({ where: { id: sellerId } });
    if (!seller) throw new NotFoundException('فروشنده یافت نشد');
    return this.prisma.sellerProfile.update({ where: { id: sellerId }, data: { isApproved: true } });
  }

  async rejectSeller(sellerId: string) {
    const seller = await this.prisma.sellerProfile.findUnique({ where: { id: sellerId } });
    if (!seller) throw new NotFoundException('فروشنده یافت نشد');
    return this.prisma.sellerProfile.update({ where: { id: sellerId }, data: { isApproved: false } });
  }

  async updateCommission(sellerId: string, rate: number) {
    const seller = await this.prisma.sellerProfile.findUnique({ where: { id: sellerId } });
    if (!seller) throw new NotFoundException('فروشنده یافت نشد');
    return this.prisma.sellerProfile.update({ where: { id: sellerId }, data: { commissionRate: rate } });
  }

  async getAllOrders(page = 1, limit = 20, status?: string, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { id: { contains: search } },
        { user: { firstName: { contains: search } } },
        { user: { lastName: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: {
            include: { book: { select: { title: true } } },
          },
          statusHistory: { orderBy: { createdAt: 'desc' } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateOrderStatus(orderId: string, status: string, note?: string) {
    const validStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`وضعیت نامعتبر. مقادیر مجاز: ${validStatuses.join(', ')}`);
    }

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('سفارش یافت نشد');

    return this.prisma.$transaction(async (tx) => {
      await tx.orderStatusHistory.create({
        data: { orderId, status, note: note || `تغییر وضعیت توسط مدیر` },
      });

      return tx.order.update({
        where: { id: orderId },
        data: { status },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: { include: { book: { select: { title: true } } } },
          statusHistory: { orderBy: { createdAt: 'desc' } },
        },
      });
    });
  }

  async getAllReviews(page = 1, limit = 20, rating?: number) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (rating) where.rating = rating;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        include: {
          user: { select: { firstName: true, lastName: true } },
          book: { select: { title: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where }),
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
