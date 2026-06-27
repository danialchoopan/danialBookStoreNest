import { IsString, IsOptional } from 'class-validator';

export class CreateSellerProfileDto {
  @IsString()
  shopName: string;

  @IsOptional()
  @IsString()
  description?: string;
}
