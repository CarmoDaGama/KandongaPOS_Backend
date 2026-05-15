import { IsString, IsNotEmpty, IsNumber, IsDate, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFinancialRecordDto {
  @IsString()
  @IsNotEmpty()
  type: 'INCOME' | 'EXPENSE'; // INCOME or EXPENSE

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsOptional()
  receiptUrl?: string;
}

export class UpdateFinancialRecordDto {
  @IsString()
  @IsOptional()
  type?: 'INCOME' | 'EXPENSE';

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}

export class ImportFinancialRecordsDto {
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @IsString()
  @IsNotEmpty()
  csvData: string; // CSV format: type,amount,category,date
}
