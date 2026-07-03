import { IsString, IsOptional } from 'class-validator';

export class UpdateSellerProfileDto {
  @IsOptional()
  @IsString()
  shopName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logo?: string;
}
