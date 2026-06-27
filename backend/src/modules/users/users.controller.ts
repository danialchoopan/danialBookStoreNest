import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('کاربران')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'لیست کاربران (مدیر)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.usersService.findAll(page, limit);
  }

  @Get('seller/stats')
  @UseGuards(RolesGuard)
  @Roles('SELLER')
  @ApiOperation({ summary: 'آمار فروشنده' })
  getSellerStats(@CurrentUser('id') userId: string) {
    return this.usersService.getSellerStats(userId);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'جزئیات کاربر (مدیر)' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/toggle-active')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'فعال/غیرفعال کردن کاربر (مدیر)' })
  toggleActive(@Param('id') id: string) {
    return this.usersService.toggleActive(id);
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'تغییر نقش کاربر (مدیر)' })
  changeRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.usersService.changeRole(id, role);
  }
}
