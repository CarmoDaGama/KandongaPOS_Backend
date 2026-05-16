import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { CreateCreditRequestDto, ReviewCreditRequestDto } from './dto/credit-request.dto';

@Injectable()
export class CreditRequestsService {
  constructor(private prisma: PrismaService) {}

  create(endUserId: string, createCreditRequestDto: CreateCreditRequestDto) {
    return this.prisma.creditRequest.create({
      data: {
        endUserId,
        entityUserId: createCreditRequestDto.entityUserId,
        businessId: createCreditRequestDto.businessId,
        amount: createCreditRequestDto.amount,
        purpose: createCreditRequestDto.purpose,
        status: 'PENDING',
      },
      include: {
        endUser: {
          select: { id: true, phone: true, name: true, role: true },
        },
        entityUser: {
          select: { id: true, phone: true, name: true, role: true },
        },
        business: {
          select: { id: true, businessName: true },
        },
      },
    });
  }

  findAll() {
    return this.prisma.creditRequest.findMany({
      include: {
        endUser: {
          select: { id: true, phone: true, name: true, role: true },
        },
        entityUser: {
          select: { id: true, phone: true, name: true, role: true },
        },
        business: {
          select: { id: true, businessName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async review(id: string, reviewerId: string, reviewCreditRequestDto: ReviewCreditRequestDto) {
    const request = await this.prisma.creditRequest.findUnique({ where: { id } });

    if (!request) {
      throw new NotFoundException(`Pedido de crédito com ID ${id} não encontrado`);
    }

    return this.prisma.creditRequest.update({
      where: { id },
      data: {
        status: reviewCreditRequestDto.status,
        aiScore: reviewCreditRequestDto.aiScore,
        paymentRef: reviewCreditRequestDto.paymentRef,
        reviewedAt: new Date(),
        reviewedById: reviewerId,
      },
      include: {
        endUser: {
          select: { id: true, phone: true, name: true, role: true },
        },
        entityUser: {
          select: { id: true, phone: true, name: true, role: true },
        },
        business: {
          select: { id: true, businessName: true },
        },
      },
    });
  }
}