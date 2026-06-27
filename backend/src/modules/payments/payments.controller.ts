import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { TopUpWalletDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('پرداخت')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('wallet/topup')
  @UseGuards(RolesGuard)
  @Roles('SELLER')
  @ApiOperation({ summary: 'شارژ کیف پول فروشنده' })
  topUpWallet(
    @CurrentUser('id') userId: string,
    @Body() dto: TopUpWalletDto,
  ) {
    return this.paymentsService.topUpWallet(userId, dto.amount);
  }

  @Get('wallet/summary')
  @UseGuards(RolesGuard)
  @Roles('SELLER')
  @ApiOperation({ summary: 'خلاصه کیف پول' })
  getWalletSummary(@CurrentUser('id') userId: string) {
    return this.paymentsService.getWalletSummary(userId);
  }

  @Post('deduct-commission/:orderId')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'کسر کمیسیون از فروشنده (مدیر)' })
  deductCommission(@Param('orderId') orderId: string) {
    return this.paymentsService.deductCommission(orderId);
  }
}
