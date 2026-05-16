import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({ example: 'Banca da Maria', description: 'Nome do negócio' })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({ example: 'individual', description: 'Tipo: individual, group, zungueira, taxi, etc.' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({ example: '1234567890123', description: 'Número de Identificação Fiscal' })
  @IsString()
  @IsOptional()
  nif?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isFormal?: boolean;

  @ApiPropertyOptional({ example: 'group_123' })
  @IsString()
  @IsOptional()
  groupId?: string;
}

export class UpdateBusinessDto {
  @ApiPropertyOptional({ example: 'Banca da Maria', description: 'Nome do negócio' })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiPropertyOptional({ example: 'group', description: 'Tipo de negócio' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ example: '1234567890123', description: 'Número de Identificação Fiscal' })
  @IsString()
  @IsOptional()
  nif?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isFormal?: boolean;

  @ApiPropertyOptional({ example: 420 })
  @IsNumber()
  @IsOptional()
  creditScore?: number;
}
