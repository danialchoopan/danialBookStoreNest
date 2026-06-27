import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('سبد خرید')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'مشاهده سبد خرید' })
  getCart(@CurrentUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'افزودن کتاب به سبد خرید' })
  addItem(@CurrentUser('id') userId: string, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(userId, dto.bookId, dto.quantity);
  }

  @Put('items/:itemId')
  @ApiOperation({ summary: 'تغییر تعداد آیتم' })
  updateQuantity(
    @CurrentUser('id') userId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(userId, itemId, dto.quantity);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'حذف آیتم از سبد خرید' })
  removeItem(@CurrentUser('id') userId: string, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(userId, itemId);
  }

  @Delete()
  @ApiOperation({ summary: 'خالی کردن سبد خرید' })
  clearCart(@CurrentUser('id') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
