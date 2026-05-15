import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsDate, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFinancialRecordDto {
  @ApiProperty({ example: 'INCOME', enum: ['INCOME', 'EXPENSE'] })
  @IsString()
  @IsNotEmpty()
  type: 'INCOME' | 'EXPENSE'; // INCOME or EXPENSE

  @ApiProperty({ example: 15000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'Vendas' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({ example: 'Venda no mercado municipal' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-05-15T10:30:00.000Z' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiPropertyOptional({ example: 'https://storage.example.com/receipt.jpg' })
  @IsString()
  @IsOptional()
  receiptUrl?: string;
}

export class UpdateFinancialRecordDto {
  @ApiPropertyOptional({ example: 'EXPENSE', enum: ['INCOME', 'EXPENSE'] })
  @IsString()
  @IsOptional()
  type?: 'INCOME' | 'EXPENSE';

  @ApiPropertyOptional({ example: 5000 })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({ example: 'Transporte' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'Compra de combustível' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}

export class ImportFinancialRecordsDto {
  @ApiProperty({ example: 'business_123' })
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @ApiProperty({ example: 'INCOME,15000,Vendas,2026-05-15\nEXPENSE,5000,Transporte,2026-05-15' })
  @IsString()
  @IsNotEmpty()
  csvData: string; // CSV format: type,amount,category,date
}
