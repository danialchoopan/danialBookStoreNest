import { IsOptional, IsString, IsObject } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsObject()
  shippingAddress?: Record<string, any>;

  @IsOptional()
  @IsString()
  note?: string;
}
