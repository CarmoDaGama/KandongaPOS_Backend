import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCreditRequestDto {
  @ApiProperty({ example: 'cmp7g0u5g00006r8umcrzny8k' })
  @IsString()
  @IsNotEmpty()
  entityUserId: string;

  @ApiPropertyOptional({ example: 'cmp7g0u5g00006r8umcrzny8k' })
  @IsString()
  @IsOptional()
  businessId?: string;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'Compra de stock para revenda' })
  @IsString()
  @IsNotEmpty()
  purpose: string;
}

export class ReviewCreditRequestDto {
  @ApiProperty({ example: 'APPROVED', enum: ['APPROVED', 'REJECTED'] })
  @IsString()
  @IsNotEmpty()
  status: 'APPROVED' | 'REJECTED';

  @ApiPropertyOptional({ example: 87.5 })
  @IsNumber()
  @IsOptional()
  aiScore?: number;

  @ApiPropertyOptional({ example: 'GPO-2026-0001' })
  @IsString()
  @IsOptional()
  paymentRef?: string;
}