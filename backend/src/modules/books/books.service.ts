import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(query: QueryBooksDto) {
    const { search, category, minPrice, maxPrice, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const cacheKey = `books:${search || ''}:${category || ''}:${minPrice || ''}:${maxPrice || ''}:${page}:${limit}`;
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const where: Prisma.BookWhereInput = {
      isPublished: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } },
          { isbn: { contains: search } },
        ],
      }),
      ...(category && {
        categories: { some: { category: { slug: category } } },
      }),
      ...((minPrice || maxPrice) && {
        price: {
          ...(minPrice && { gte: minPrice }),
          ...(maxPrice && { lte: maxPrice }),
        },
      }),
    };

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        include: {
          seller: { select: { shopName: true, shopSlug: true } },
          categories: { include: { category: { select: { name: true, slug: true } } } },
          reviews: { select: { rating: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.book.count({ where }),
    ]);

    const booksWithRating = books.map((book) => ({
      ...book,
      averageRating: book.reviews.length
        ? book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length
        : null,
      reviews: undefined,
    }));

    const result = {
      data: booksWithRating,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };

    await this.redis.set(cacheKey, result, 300);
    return result;
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        seller: { select: { shopName: true, shopSlug: true } },
        categories: { include: { category: true } },
        reviews: {
          include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!book) {
      throw new NotFoundException('کتاب یافت نشد');
    }

    const averageRating = book.reviews.length
      ? book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length
      : null;

    return { ...book, averageRating };
  }

  async create(sellerId: string, dto: CreateBookDto) {
    const sellerProfile = await this.prisma.sellerProfile.findUnique({
      where: { userId: sellerId },
    });

    if (!sellerProfile || !sellerProfile.isApproved) {
      throw new ForbiddenException('فروشنده تأیید نشده است');
    }

    const slug = dto.title
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/^-|-$/g, '');

    const book = await this.prisma.book.create({
      data: {
        sellerId: sellerProfile.id,
        ...dto,
        slug,
        categories: dto.categoryIds?.length
          ? { create: dto.categoryIds.map((categoryId) => ({ categoryId })) }
          : undefined,
      },
      include: { categories: { include: { category: true } } },
    });

    await this.redis.delPattern('books:*');
    return book;
  }

  async update(sellerId: string, bookId: string, dto: UpdateBookDto) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      throw new NotFoundException('کتاب یافت نشد');
    }

    if (book.sellerId !== sellerId) {
      throw new ForbiddenException('شما اجازه ویرایش این کتاب را ندارید');
    }

    if (dto.categoryIds) {
      await this.prisma.bookCategory.deleteMany({ where: { bookId } });
    }

    const updated = await this.prisma.book.update({
      where: { id: bookId },
      data: {
        ...dto,
        categoryIds: undefined,
        ...(dto.categoryIds && {
          categories: { create: dto.categoryIds.map((categoryId) => ({ categoryId })) },
        }),
      },
      include: { categories: { include: { category: true } } },
    });

    await this.redis.delPattern('books:*');
    return updated;
  }

  async remove(sellerId: string, bookId: string) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      throw new NotFoundException('کتاب یافت نشد');
    }

    if (book.sellerId !== sellerId) {
      throw new ForbiddenException('شما اجازه حذف این کتاب را ندارید');
    }

    await this.prisma.book.delete({ where: { id: bookId } });
    await this.redis.delPattern('books:*');
    return { message: 'کتاب با موفقیت حذف شد' };
  }
}
