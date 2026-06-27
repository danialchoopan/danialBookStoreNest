import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('کتاب‌ها')
@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'لیست کتاب‌ها با جستجو و فیلتر' })
  findAll(@Query() query: QueryBooksDto) {
    return this.booksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جزئیات کتاب' })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'افزودن کتاب جدید (فروشنده)' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateBookDto) {
    return this.booksService.create(userId, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ویرایش کتاب (فروشنده)' })
  update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف کتاب (فروشنده)' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.booksService.remove(userId, id);
  }
}
