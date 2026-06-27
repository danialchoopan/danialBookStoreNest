import { IsNumber, Min, Max } from 'class-validator';

export class TopUpWalletDto {
  @IsNumber()
  @Min(10000)
  @Max(50000000)
  amount: number;
}
