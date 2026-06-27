import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
            _count: { select: { books: true } },
          },
        },
        _count: { select: { books: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: { include: { _count: { select: { books: true } } } },
        books: {
          include: {
            book: {
              include: {
                seller: { select: { shopName: true } },
                reviews: { select: { rating: true } },
              },
            },
          },
          take: 20,
        },
      },
    });

    if (!category) {
      throw new NotFoundException('دسته‌بندی یافت نشد');
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.name
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/^-|-$/g, '');

    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException('این دسته‌بندی قبلاً ایجاد شده است');
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        parentId: dto.parentId,
      },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('دسته‌بندی یافت نشد');
    }

    const data: any = {};
    if (dto.name) {
      data.name = dto.name;
      data.slug = dto.name
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    if (dto.parentId !== undefined) {
      data.parentId = dto.parentId;
    }

    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { children: true, books: true },
    });

    if (!category) {
      throw new NotFoundException('دسته‌بندی یافت نشد');
    }

    if (category.children.length > 0) {
      throw new ConflictException('این دسته‌بندی دارای زیرمجموعه است و قابل حذف نیست');
    }

    await this.prisma.bookCategory.deleteMany({ where: { categoryId: id } });
    await this.prisma.category.delete({ where: { id } });

    return { message: 'دسته‌بندی با موفقیت حذف شد' };
  }
}
