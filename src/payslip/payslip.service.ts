import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaySlipService {
  constructor(private prisma: PrismaService) {}

  async createPaySlip(data: Prisma.PaySlipCreateInput) {
    return this.prisma.paySlip.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.paySlip.findMany({
      include: {
        employee: true, // Include the related Employee details
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.paySlip.findUnique({
      where: { id },
      include: {
        employee: true, // Include the related Employee details
      },
    });
  }

  async update(id: string, data: Prisma.PaySlipUpdateInput) {
    return this.prisma.paySlip.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.paySlip.delete({
      where: { id },
    });
  }
}
