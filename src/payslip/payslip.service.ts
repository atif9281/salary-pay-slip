import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaySlipService {
  constructor(private prisma: PrismaService) {}

  // Helper function to safely convert any type to a number
  private toNumber(value: any): number {
    if (value === null || value === undefined) {
      return 0;
    } else if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    } else if (typeof value === 'number') {
      return value;
    } else if (typeof value.toNumber === 'function') {
      return value.toNumber();
    } else {
      return 0;
    }
  }

  // 1. Create a Pay Slip
  async createPaySlip(
    data: Prisma.PaySlipCreateInput,
    totalWorkingDays: number,
    daysWorked: number
  ) {
    const { employee, basicSalary } = data;

    if (!employee || !employee.connect || !employee.connect.id) {
      throw new BadRequestException('Employee ID is required');
    }

    const basicSalaryNumber = this.toNumber(basicSalary);
    if (basicSalaryNumber <= 0) {
      throw new BadRequestException('Basic Salary must be greater than zero');
    }

    const oneDayIncome = basicSalaryNumber / totalWorkingDays;
    const extraDaysWorked = Math.max(0, daysWorked - totalWorkingDays);
    const bonus = oneDayIncome * extraDaysWorked;
    const absentees = Math.max(0, totalWorkingDays - daysWorked);
    const absenteesExcludingPaidLeave = Math.max(0, absentees - 1);
    const deduction = oneDayIncome * absenteesExcludingPaidLeave;
    const netSalary = basicSalaryNumber + bonus - deduction;

    // Calculate paid and unpaid leaves
    const paidLeaves = daysWorked < totalWorkingDays ? 1 : 0;
    const unpaidLeaves = daysWorked >= totalWorkingDays ? 0 : totalWorkingDays - daysWorked - paidLeaves;

    try {
      return await this.prisma.paySlip.create({
        data: {
          employee: {
            connect: { id: employee.connect.id }, // Connect using employeeId
          },
          basicSalary: basicSalaryNumber,
          payDate: data.payDate,
          month: data.month,
          year: data.year,
          bonuses: bonus,
          deductions: deduction,
          netSalary: netSalary,
          totalWorkingDays, // Add totalWorkingDays
          daysWorked,       // Add daysWorked
          paidLeaves,       // Add paidLeaves
          unpaidLeaves,     // Add unpaidLeaves
        },
      });
    } catch (error) {
      console.error('Error creating Pay Slip:', error);
      throw new BadRequestException('Failed to create Pay Slip');
    }
  }

  // 2. Get a Pay Slip by ID
  async getPaySlipById(id: string) {
    const paySlip = await this.prisma.paySlip.findUnique({
      where: { id: id },
    });

    if (!paySlip) {
      throw new NotFoundException('Pay Slip not found');
    }

    return paySlip;
  }

  // 3. Update a Pay Slip by ID
  async updatePaySlip(
    id: string,
    data: Prisma.PaySlipUpdateInput,
    totalWorkingDays: number,
    daysWorked: number
  ) {
    const paySlip = await this.prisma.paySlip.findUnique({ where: { id: id } });
    if (!paySlip) {
      throw new NotFoundException('Pay Slip not found');
    }

    const basicSalaryNumber = this.toNumber(paySlip.basicSalary);
    const oneDayIncome = basicSalaryNumber / totalWorkingDays;
    const extraDaysWorked = Math.max(0, daysWorked - totalWorkingDays);
    const bonus = oneDayIncome * extraDaysWorked;
    const absentees = Math.max(0, totalWorkingDays - daysWorked);
    const absenteesExcludingPaidLeave = Math.max(0, absentees - 1);
    const deduction = oneDayIncome * absenteesExcludingPaidLeave;
    const netSalary = basicSalaryNumber + bonus - deduction;

    // Calculate paid and unpaid leaves
    const paidLeaves = daysWorked < totalWorkingDays ? 1 : 0;
    const unpaidLeaves = daysWorked >= totalWorkingDays ? 0 : totalWorkingDays - daysWorked - paidLeaves;

    try {
      return await this.prisma.paySlip.update({
        where: { id: id },
        data: {
          ...data,
          bonuses: bonus,
          deductions: deduction,
          netSalary: netSalary,
          totalWorkingDays, // Update totalWorkingDays
          daysWorked,       // Update daysWorked
          paidLeaves,       // Update paidLeaves
          unpaidLeaves,     // Update unpaidLeaves
        },
      });
    } catch (error) {
      console.error('Error updating Pay Slip:', error);
      throw new BadRequestException('Failed to update Pay Slip');
    }
  }

  // 4. Delete a Pay Slip by ID
  async deletePaySlip(id: string) {
    const paySlip = await this.prisma.paySlip.findUnique({ where: { id: id } });
    if (!paySlip) {
      throw new NotFoundException('Pay Slip not found');
    }

    try {
      return await this.prisma.paySlip.delete({
        where: { id: id },
      });
    } catch (error) {
      console.error('Error deleting Pay Slip:', error);
      throw new BadRequestException('Failed to delete Pay Slip');
    }
  }

  // 5. Get All Pay Slips
  async getAllPaySlips() {
    return this.prisma.paySlip.findMany();
  }
}
