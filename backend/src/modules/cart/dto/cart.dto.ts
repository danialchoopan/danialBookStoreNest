import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  bookId: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  quantity: number;
}
