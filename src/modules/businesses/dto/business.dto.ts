import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({ example: 'Banca da Maria' })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({ example: 'individual' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({ example: '1234567890123' })
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
  @ApiPropertyOptional({ example: 'Banca da Maria' })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiPropertyOptional({ example: 'group' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ example: '1234567890123' })
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
