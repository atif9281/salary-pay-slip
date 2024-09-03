import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async createDepartment(data: Prisma.DepartmentCreateInput) {
    return this.prisma.department.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.department.findMany({
      include: {
        employees: true, // Include the related Employees
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.department.findUnique({
      where: { id },
      include: {
        employees: true, // Include the related Employees
      },
    });
  }

  async update(id: string, data: Prisma.DepartmentUpdateInput) {
    return this.prisma.department.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.department.delete({
      where: { id },
    });
  }
}
