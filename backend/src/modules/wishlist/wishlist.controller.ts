import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('علاقه‌مندی‌ها')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'لیست علاقه‌مندی‌ها' })
  getWishlist(@CurrentUser('id') userId: string) {
    return this.wishlistService.getWishlist(userId);
  }

  @Post(':bookId')
  @ApiOperation({ summary: 'افزودن به علاقه‌مندی‌ها' })
  addToWishlist(@CurrentUser('id') userId: string, @Param('bookId') bookId: string) {
    return this.wishlistService.addToWishlist(userId, bookId);
  }

  @Delete(':bookId')
  @ApiOperation({ summary: 'حذف از علاقه‌مندی‌ها' })
  removeFromWishlist(@CurrentUser('id') userId: string, @Param('bookId') bookId: string) {
    return this.wishlistService.removeFromWishlist(userId, bookId);
  }

  @Post(':bookId/toggle')
  @ApiOperation({ summary: 'toggle علاقه‌مندی' })
  toggleWishlist(@CurrentUser('id') userId: string, @Param('bookId') bookId: string) {
    return this.wishlistService.toggleWishlist(userId, bookId);
  }
}
