import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SellerService } from './seller.service';
import { CreateSellerProfileDto } from './dto/seller.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('فروشنده')
@Controller('seller')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SellerController {
  constructor(private sellerService: SellerService) {}

  @Get('profile')
  @ApiOperation({ summary: 'پروفایل فروشنده' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.sellerService.getProfile(userId);
  }

  @Post('profile')
  @UseGuards(RolesGuard)
  @Roles('SELLER')
  @ApiOperation({ summary: 'ایجاد پروفایل فروشنده' })
  createProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSellerProfileDto,
  ) {
    return this.sellerService.createProfile(userId, dto);
  }

  @Get('dashboard')
  @UseGuards(RolesGuard)
  @Roles('SELLER')
  @ApiOperation({ summary: 'داشبورد فروشنده' })
  getDashboard(@CurrentUser('id') userId: string) {
    return this.sellerService.getDashboard(userId);
  }

  @Get('books')
  @UseGuards(RolesGuard)
  @Roles('SELLER')
  @ApiOperation({ summary: 'لیست کتاب‌های فروشنده' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getMyBooks(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.sellerService.getMyBooks(userId, page, limit);
  }

  @Get('wallet')
  @UseGuards(RolesGuard)
  @Roles('SELLER')
  @ApiOperation({ summary: 'کیف پول فروشنده' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getWallet(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.sellerService.getWallet(userId, page, limit);
  }

  @Get('orders')
  @UseGuards(RolesGuard)
  @Roles('SELLER')
  @ApiOperation({ summary: 'سفارشات فروشنده' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getOrders(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.sellerService.getOrders(userId, page, limit);
  }

  @Patch('orders/:orderId/status')
  @UseGuards(RolesGuard)
  @Roles('SELLER')
  @ApiOperation({ summary: 'تغییر وضعیت سفارش' })
  updateOrderStatus(
    @CurrentUser('id') userId: string,
    @Param('orderId') orderId: string,
    @Body('status') status: string,
  ) {
    return this.sellerService.updateOrderStatus(userId, orderId, status);
  }
}
