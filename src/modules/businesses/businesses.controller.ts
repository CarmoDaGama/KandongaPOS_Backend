import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';

@ApiTags('Businesses')
@Controller('businesses')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class BusinessesController {
  constructor(private businessesService: BusinessesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo negócio' })
  create(@Body() createBusinessDto: CreateBusinessDto, @Request() req) {
    return this.businessesService.create(createBusinessDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar negócios do usuário' })
  findAll(@Request() req) {
    return this.businessesService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter negócio por ID' })
  findOne(@Param('id') id: string) {
    return this.businessesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar negócio' })
  update(@Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDto) {
    return this.businessesService.update(id, updateBusinessDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar negócio' })
  remove(@Param('id') id: string) {
    return this.businessesService.remove(id);
  }

  @Get(':id/credit-score')
  @ApiOperation({ summary: 'Calcular score de crédito do negócio' })
  async calculateCreditScore(@Param('id') id: string) {
    const score = await this.businessesService.calculateCreditScore(id);
    return { businessId: id, creditScore: score };
  }
}
