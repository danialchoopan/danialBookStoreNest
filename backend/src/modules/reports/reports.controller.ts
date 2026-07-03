import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('گزارش‌ها')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class ReportsController {
  constructor(private prisma: PrismaService) {}

  @Get('sales/csv')
  @ApiOperation({ summary: 'دانلود گزارش فروش CSV' })
  @ApiQuery({ name: 'days', required: false })
  async exportSalesCsv(@Query('days') days: string, @Res() res: Response) {
    const daysNum = parseInt(days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - daysNum);

    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: since } },
      include: {
        items: { include: { book: { select: { title: true } } } },
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Build CSV
    const headers = ['شماره سفارش', 'تاریخ', 'مشتری', 'ایمیل', 'وضعیت', 'مبلغ', 'تعداد اقلام'];
    const rows = orders.map((order) => [
      order.id.slice(0, 12),
      new Date(order.createdAt).toLocaleDateString('fa-IR'),
      `${order.user.firstName} ${order.user.lastName}`,
      order.user.email,
      order.status,
      order.totalAmount,
      order.items.length,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    // Add BOM for Excel UTF-8 support
    const bom = '\uFEFF';
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=sales-report-${daysNum}days.csv`);
    res.send(bom + csvContent);
  }

  @Get('summary')
  @ApiOperation({ summary: 'خلاصه آمار فروش' })
  @ApiQuery({ name: 'days', required: false })
  async getSalesSummary(@Query('days') days: string) {
    const daysNum = parseInt(days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - daysNum);

    const [totalOrders, totalRevenue, topBooks, topSellers, statusBreakdown] = await Promise.all([
      this.prisma.order.count({ where: { createdAt: { gte: since } } }),
      this.prisma.order.aggregate({
        where: { createdAt: { gte: since }, status: 'DELIVERED' },
        _sum: { totalAmount: true },
      }),
      this.prisma.orderItem.groupBy({
        by: ['bookId'],
        where: { order: { createdAt: { gte: since } } },
        _sum: { quantity: true, totalPrice: true },
        _count: true,
        orderBy: { _sum: { totalPrice: 'desc' } },
        take: 5,
      }),
      this.prisma.orderItem.groupBy({
        by: ['sellerId'],
        where: { order: { createdAt: { gte: since } } },
        _sum: { totalPrice: true },
        _count: true,
        orderBy: { _sum: { totalPrice: 'desc' } },
        take: 5,
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        where: { createdAt: { gte: since } },
        _count: true,
      }),
    ]);

    // Resolve book and seller names
    const bookIds = topBooks.map((b) => b.bookId);
    const sellerIds = topSellers.map((s) => s.sellerId);

    const [books, sellers] = await Promise.all([
      this.prisma.book.findMany({ where: { id: { in: bookIds } }, select: { id: true, title: true } }),
      this.prisma.sellerProfile.findMany({ where: { id: { in: sellerIds } }, select: { id: true, shopName: true } }),
    ]);

    return {
      period: `${daysNum} روز اخیر`,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      topBooks: topBooks.map((b) => ({
        title: books.find((bk) => bk.id === b.bookId)?.title || 'نامشخص',
        totalSold: b._sum.quantity,
        totalRevenue: b._sum.totalPrice,
      })),
      topSellers: topSellers.map((s) => ({
        shopName: sellers.find((sl) => sl.id === s.sellerId)?.shopName || 'نامشخص',
        totalRevenue: s._sum.totalPrice,
        orderCount: s._count,
      })),
      statusBreakdown: statusBreakdown.map((s) => ({
        status: s.status,
        count: s._count,
      })),
    };
  }
}
