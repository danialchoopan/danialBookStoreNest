import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('مدیریت')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'داشبورد مدیر' })
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('sellers')
  @ApiOperation({ summary: 'لیست فروشندگان' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getAllSellers(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getAllSellers(page, limit);
  }

  @Patch('sellers/:id/approve')
  @ApiOperation({ summary: 'تأیید فروشنده' })
  approveSeller(@Param('id') id: string) {
    return this.adminService.approveSeller(id);
  }

  @Patch('sellers/:id/reject')
  @ApiOperation({ summary: 'رد فروشنده' })
  rejectSeller(@Param('id') id: string) {
    return this.adminService.rejectSeller(id);
  }

  @Patch('sellers/:id/commission')
  @ApiOperation({ summary: 'تنظیم کمیسیون فروشنده' })
  updateCommission(@Param('id') id: string, @Body('rate') rate: number) {
    return this.adminService.updateCommission(id, rate);
  }

  @Get('orders')
  @ApiOperation({ summary: 'لیست همه سفارشات' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getAllOrders(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getAllOrders(page, limit);
  }

  @Get('reviews')
  @ApiOperation({ summary: 'لیست همه نظرات' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getAllReviews(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getAllReviews(page, limit);
  }

  @Delete('reviews/:id')
  @ApiOperation({ summary: 'حذف نظر' })
  deleteReview(@Param('id') id: string) {
    return this.adminService.deleteReview(id);
  }
}
