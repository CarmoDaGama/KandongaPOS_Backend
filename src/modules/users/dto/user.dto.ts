import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: '+244912345678' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Joao Pedro' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'joao@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Joao Pedro' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'joao@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;
}
