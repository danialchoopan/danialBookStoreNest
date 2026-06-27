import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findByBook(bookId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { bookId },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { bookId } }),
    ]);

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

    return {
      data: reviews,
      averageRating: avgRating,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async create(userId: string, bookId: string, dto: CreateReviewDto) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException('کتاب یافت نشد');
    }

    const existing = await this.prisma.review.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });

    if (existing) {
      throw new ForbiddenException('شما قبلاً برای این کتاب نظر ثبت کرده‌اید');
    }

    const hasOrdered = await this.prisma.orderItem.findFirst({
      where: {
        bookId,
        order: { userId, status: 'DELIVERED' },
      },
    });

    if (!hasOrdered) {
      throw new ForbiddenException('فقط خریداران این کتاب می‌توانند نظر ثبت کنند');
    }

    return this.prisma.review.create({
      data: {
        userId,
        bookId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    });
  }

  async update(userId: string, reviewId: string, dto: CreateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) {
      throw new NotFoundException('نظر یافت نشد');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('شما اجازه ویرایش این نظر را ندارید');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: { rating: dto.rating, comment: dto.comment },
    });
  }

  async remove(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) {
      throw new NotFoundException('نظر یافت نشد');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('شما اجازه حذف این نظر را ندارید');
    }

    await this.prisma.review.delete({ where: { id: reviewId } });
    return { message: 'نظر با موفقیت حذف شد' };
  }

  async getMyReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { userId },
      include: {
        book: { select: { id: true, title: true, slug: true, images: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
