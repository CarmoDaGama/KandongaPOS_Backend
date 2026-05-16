import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreditRequestsService } from './credit-requests.service';
import { CreateCreditRequestDto, ReviewCreditRequestDto } from './dto/credit-request.dto';

@ApiTags('Credit Requests')
@Controller('credit-requests')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CreditRequestsController {
  constructor(private creditRequestsService: CreditRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar pedido de crédito' })
  create(@Request() req, @Body() createCreditRequestDto: CreateCreditRequestDto) {
    return this.creditRequestsService.create(req.user.id, createCreditRequestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pedidos de crédito' })
  findAll() {
    return this.creditRequestsService.findAll();
  }

  @Patch(':id/review')
  @ApiOperation({ summary: 'Rever pedido de crédito' })
  review(
    @Param('id') id: string,
    @Request() req,
    @Body() reviewCreditRequestDto: ReviewCreditRequestDto,
  ) {
    return this.creditRequestsService.review(id, req.user.id, reviewCreditRequestDto);
  }
}