import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { CreateFinancialRecordDto, UpdateFinancialRecordDto } from './dto/financial-record.dto';

@Injectable()
export class FinancialRecordsService {
  constructor(private prisma: PrismaService) {}

  async create(createFinancialRecordDto: CreateFinancialRecordDto, businessId: string) {
    // Verify business exists
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Negócio com ID ${businessId} não encontrado`);
    }

    return this.prisma.financialRecord.create({
      data: {
        businessId,
        type: createFinancialRecordDto.type,
        amount: createFinancialRecordDto.amount,
        category: createFinancialRecordDto.category,
        description: createFinancialRecordDto.description,
        date: new Date(createFinancialRecordDto.date),
        receiptUrl: createFinancialRecordDto.receiptUrl,
      },
    });
  }

  async findByBusiness(businessId: string) {
    // Verify business exists
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Negócio com ID ${businessId} não encontrado`);
    }

    return this.prisma.financialRecord.findMany({
      where: { businessId },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.financialRecord.findUnique({
      where: { id },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            owner: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!record) {
      throw new NotFoundException(`Registro financeiro com ID ${id} não encontrado`);
    }

    return record;
  }

  async update(id: string, updateFinancialRecordDto: UpdateFinancialRecordDto) {
    const record = await this.prisma.financialRecord.findUnique({ where: { id } });

    if (!record) {
      throw new NotFoundException(`Registro financeiro com ID ${id} não encontrado`);
    }

    return this.prisma.financialRecord.update({
      where: { id },
      data: updateFinancialRecordDto,
    });
  }

  async remove(id: string) {
    const record = await this.prisma.financialRecord.findUnique({ where: { id } });

    if (!record) {
      throw new NotFoundException(`Registro financeiro com ID ${id} não encontrado`);
    }

    return this.prisma.financialRecord.delete({
      where: { id },
      select: {
        id: true,
        type: true,
        amount: true,
      },
    });
  }

  async getBalance(businessId: string) {
    const records = await this.findByBusiness(businessId);

    const income = records
      .filter((r) => r.type === 'INCOME')
      .reduce((sum, r) => sum + r.amount, 0);

    const expenses = records
      .filter((r) => r.type === 'EXPENSE')
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      businessId,
      income,
      expenses,
      balance: income - expenses,
      totalRecords: records.length,
    };
  }

  async getSummaryByCategory(businessId: string) {
    const records = await this.findByBusiness(businessId);

    const summary: Record<string, { income: number; expense: number }> = {};

    records.forEach((record) => {
      if (!summary[record.category]) {
        summary[record.category] = { income: 0, expense: 0 };
      }

      if (record.type === 'INCOME') {
        summary[record.category].income += record.amount;
      } else {
        summary[record.category].expense += record.amount;
      }
    });

    return {
      businessId,
      summary,
    };
  }

  async importCsv(businessId: string, csvData: string) {
    const lines = csvData.trim().split('\n');
    const results = [];

    for (const line of lines) {
      const [type, amountStr, category, dateStr] = line.split(',');

      if (!type || !amountStr || !category || !dateStr) {
        continue; // Skip invalid lines
      }

      try {
        const record = await this.create(
          {
            type: type as 'INCOME' | 'EXPENSE',
            amount: parseFloat(amountStr),
            category: category.trim(),
            date: new Date(dateStr),
          },
          businessId,
        );
        results.push(record);
      } catch (error) {
        // Log error but continue with next record
        console.error(`Erro ao importar linha: ${line}`, error);
      }
    }

    return {
      businessId,
      importedRecords: results.length,
      records: results,
    };
  }
}
