import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DownloadsService {
  constructor(private prisma: PrismaService) {}

  async getMyBooks(userId: string) {
    const purchases = await this.prisma.ebookPurchase.findMany({
      where: { userId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            slug: true,
            images: true,
            ebookFileUrl: true,
            ebookFileSize: true,
            ebookPrice: true,
            format: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return purchases.map((p) => ({
      ...p.book,
      purchaseId: p.id,
      downloadCount: p.downloadCount,
      purchasedAt: p.createdAt,
    }));
  }

  async getEbookFile(userId: string, bookId: string) {
    const purchase = await this.prisma.ebookPurchase.findUnique({
      where: { userId_bookId: { userId, bookId } },
      include: { book: { select: { ebookFileUrl: true, title: true } } },
    });

    if (!purchase) {
      throw new ForbiddenException('شما این کتاب را خریداری نکرده‌اید');
    }

    if (!purchase.book.ebookFileUrl) {
      throw new NotFoundException('فایل کتاب الکترونیکی موجود نیست');
    }

    // Resolve file path
    const filename = path.basename(purchase.book.ebookFileUrl);
    const filePath = path.join(process.cwd(), 'uploads', 'ebooks', filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('فایل کتاب یافت نشد');
    }

    // Increment download count
    await this.prisma.ebookPurchase.update({
      where: { id: purchase.id },
      data: { downloadCount: { increment: 1 } },
    });

    return { filePath, title: purchase.book.title };
  }
}
