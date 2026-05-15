import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FinancialRecordsService } from './financial-records.service';
import {
  CreateFinancialRecordDto,
  UpdateFinancialRecordDto,
  ImportFinancialRecordsDto,
} from './dto/financial-record.dto';

@ApiTags('Financial Records')
@Controller('financial-records')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class FinancialRecordsController {
  constructor(private financialRecordsService: FinancialRecordsService) {}

  @Post('business/:businessId')
  @ApiOperation({ summary: 'Criar novo registro financeiro' })
  create(
    @Param('businessId') businessId: string,
    @Body() createFinancialRecordDto: CreateFinancialRecordDto,
  ) {
    return this.financialRecordsService.create(createFinancialRecordDto, businessId);
  }

  @Get('business/:businessId')
  @ApiOperation({ summary: 'Listar registros financeiros do negócio' })
  findByBusiness(@Param('businessId') businessId: string) {
    return this.financialRecordsService.findByBusiness(businessId);
  }

  @Get('business/:businessId/balance')
  @ApiOperation({ summary: 'Obter balanço do negócio' })
  getBalance(@Param('businessId') businessId: string) {
    return this.financialRecordsService.getBalance(businessId);
  }

  @Get('business/:businessId/summary-by-category')
  @ApiOperation({ summary: 'Obter resumo por categoria' })
  getSummaryByCategory(@Param('businessId') businessId: string) {
    return this.financialRecordsService.getSummaryByCategory(businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter registro financeiro por ID' })
  findOne(@Param('id') id: string) {
    return this.financialRecordsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar registro financeiro' })
  update(
    @Param('id') id: string,
    @Body() updateFinancialRecordDto: UpdateFinancialRecordDto,
  ) {
    return this.financialRecordsService.update(id, updateFinancialRecordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar registro financeiro' })
  remove(@Param('id') id: string) {
    return this.financialRecordsService.remove(id);
  }

  @Post('import-csv')
  @ApiOperation({ summary: 'Importar registros financeiros de CSV' })
  importCsv(@Body() importFinancialRecordsDto: ImportFinancialRecordsDto) {
    return this.financialRecordsService.importCsv(
      importFinancialRecordsDto.businessId,
      importFinancialRecordsDto.csvData,
    );
  }
}
