import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  async create(createBusinessDto: CreateBusinessDto, userId: string) {
    return this.prisma.business.create({
      data: {
        businessName: createBusinessDto.businessName,
        type: createBusinessDto.type,
        nif: createBusinessDto.nif,
        isFormal: createBusinessDto.isFormal || false,
        groupId: createBusinessDto.groupId,
        userId,
      },
    });
  }

  async findAll(userId?: string) {
    const where = userId ? { userId } : {};
    return this.prisma.business.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        financialRecords: true,
        invoices: true,
      },
    });
  }

  async findOne(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        financialRecords: true,
        invoices: true,
        inventoryItems: true,
      },
    });

    if (!business) {
      throw new NotFoundException(`Negócio com ID ${id} não encontrado`);
    }

    return business;
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto) {
    const business = await this.prisma.business.findUnique({ where: { id } });

    if (!business) {
      throw new NotFoundException(`Negócio com ID ${id} não encontrado`);
    }

    return this.prisma.business.update({
      where: { id },
      data: updateBusinessDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const business = await this.prisma.business.findUnique({ where: { id } });

    if (!business) {
      throw new NotFoundException(`Negócio com ID ${id} não encontrado`);
    }

    return this.prisma.business.delete({
      where: { id },
      select: {
        id: true,
        businessName: true,
      },
    });
  }

  async calculateCreditScore(businessId: string): Promise<number> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        financialRecords: true,
        inventoryItems: true,
      },
    });

    if (!business) {
      throw new NotFoundException(`Negócio com ID ${businessId} não encontrado`);
    }

    let score = 0;

    // Base score
    score += 100;

    // Transaction volume (max +300)
    const totalRecords = business.financialRecords.length;
    score += Math.min(totalRecords * 5, 300);

    // Income regularity (max +200)
    const incomeRecords = business.financialRecords.filter((r) => r.type === 'INCOME');
    if (incomeRecords.length > 0) {
      score += Math.min(incomeRecords.length * 10, 200);
    }

    // Inventory management (max +150)
    const inventoryValue = business.inventoryItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    if (inventoryValue > 0) {
      score += Math.min(inventoryValue / 100, 150);
    }

    // Formalization bonus (+100)
    if (business.isFormal) {
      score += 100;
    }

    // Cap at 1000
    return Math.min(score, 1000);
  }
}
