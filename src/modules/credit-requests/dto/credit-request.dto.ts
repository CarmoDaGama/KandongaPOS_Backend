import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCreditRequestDto {
  @ApiProperty({ example: 'cmp7g0u5g00006r8umcrzny8k', description: 'ID do banco/instituição que irá processar o pedido' })
  @IsString()
  @IsNotEmpty()
  entityUserId: string;

  @ApiPropertyOptional({ example: 'cmp7g0u5g00006r8umcrzny8k', description: 'ID do negócio (opcional)' })
  @IsString()
  @IsOptional()
  businessId?: string;

  @ApiProperty({ example: 150000, description: 'Valor do crédito solicitado em Kwanzas' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'Compra de stock para revenda', description: 'Finalidade do crédito' })
  @IsString()
  @IsNotEmpty()
  purpose: string;
}

export class ReviewCreditRequestDto {
  @ApiProperty({ example: 'APPROVED', enum: ['APPROVED', 'REJECTED'], description: 'Decisão do banco/instituição' })
  @IsString()
  @IsNotEmpty()
  status: 'APPROVED' | 'REJECTED';

  @ApiPropertyOptional({ example: 87.5, description: 'Score de análise IA (0-100)' })
  @IsNumber()
  @IsOptional()
  aiScore?: number;

  @ApiPropertyOptional({ example: 'GPO-2026-0001', description: 'Referência de pagamento GPO' })
  @IsString()
  @IsOptional()
  paymentRef?: string;
}