import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';

@ApiTags('جستجو')
@Controller('search')
export class SearchController {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  @Get('autocomplete')
  @ApiOperation({ summary: 'پیشنهادات جستجو' })
  @ApiQuery({ name: 'q', required: true })
  async autocomplete(@Query('q') query: string) {
    if (!query || query.length < 2) {
      return { suggestions: [] };
    }

    const cacheKey = `search:ac:${query.toLowerCase()}`;
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const books = await this.prisma.book.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } },
          { isbn: { contains: query } },
        ],
      },
      select: {
        id: true,
        title: true,
        author: true,
        price: true,
        images: true,
        seller: { select: { shopName: true } },
      },
      take: 8,
    });

    const categories = await this.prisma.category.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      select: { id: true, name: true, slug: true },
      take: 4,
    });

    const result = { books, categories };
    await this.redis.set(cacheKey, result, 120);
    return result;
  }

  @Get('popular')
  @ApiOperation({ summary: 'جستجوهای محبوب' })
  async popularSearches() {
    return {
      searches: [
        'بوف کور',
        'رمان فارسی',
        'کتاب کودک',
        'برنامه‌نویسی',
        'فلسفه',
        'تاریخ ایران',
        'روانشناسی',
        'شعر نو',
      ],
    };
  }
}
