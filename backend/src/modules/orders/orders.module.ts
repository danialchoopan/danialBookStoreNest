import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderTrackingService } from './order-tracking.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrderTrackingService],
  exports: [OrdersService, OrderTrackingService],
})
export class OrdersModule {}
