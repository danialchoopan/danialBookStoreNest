import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min, IsIn } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  comparePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  images?: string | string[];

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsIn(['PHYSICAL', 'DIGITAL', 'BOTH'])
  format?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  ebookPrice?: number;

  @IsOptional()
  @IsString()
  ebookFileUrl?: string;

  @IsOptional()
  @IsNumber()
  ebookFileSize?: number;
}
