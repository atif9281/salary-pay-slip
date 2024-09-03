import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async createEmployee(data: Prisma.EmployeeCreateInput) {
    return this.prisma.employee.create({
      data: {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        position: data.position,
        salary: data.salary,
        dateOfJoining: data.dateOfJoining,
        bankAccountNumber: data.bankAccountNumber,
        bankName: data.bankName,
        department: data.department ? {
          connect: { id: data.department.connect.id }
        } : undefined,
        paySlips: data.paySlips?.create && Array.isArray(data.paySlips.create) ? {
          create: data.paySlips.create
        } : undefined
      }
    });
  }

  async findAll() {
    return this.prisma.employee.findMany({
      include: {
        department: true,
        paySlips: true
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        paySlips: true
      }
    });
  }

  async update(id: string, data: Prisma.EmployeeUpdateInput) {
    return this.prisma.employee.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        position: data.position,
        salary: data.salary,
        dateOfJoining: data.dateOfJoining,
        bankAccountNumber: data.bankAccountNumber,
        bankName: data.bankName,
        department: data.department ? {
          connect: { id: data.department.connect.id }
        } : undefined,
        paySlips: {
          create: data.paySlips?.create && Array.isArray(data.paySlips.create) ? data.paySlips.create : [],
          update: data.paySlips?.update && Array.isArray(data.paySlips.update) ? data.paySlips.update : [],
          deleteMany: data.paySlips?.deleteMany || []
        }
      }
    });
  }

  async remove(id: string) {
    return this.prisma.employee.delete({
      where: { id }
    });
  }
}
