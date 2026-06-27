import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('سفارشات')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'ایجاد سفارش جدید از سبد خرید' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'لیست سفارشات کاربر' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ordersService.findAll(userId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جزئیات سفارش' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.ordersService.findOne(userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'لغو سفارش' })
  cancel(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.ordersService.cancel(userId, id);
  }
}
