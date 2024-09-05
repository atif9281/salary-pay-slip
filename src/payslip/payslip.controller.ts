import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PaySlipService } from './payslip.service';
import { Prisma } from '@prisma/client';

@Controller('payslip')
export class PaySlipController {
  constructor(private readonly paySlipService: PaySlipService) {}

  // 1. Get Pay Slip by ID
  @Get(':id')
  async getPaySlipById(@Param('id') id: string) {
    return this.paySlipService.getPaySlipById(id);
  }

  // 2. Create a Pay Slip
  @Post()
  async createPaySlip(
    @Body() data: Prisma.PaySlipCreateInput,
    @Body('totalWorkingDays') totalWorkingDays: number,
    @Body('daysWorked') daysWorked: number
  ) {
    return this.paySlipService.createPaySlip(data, totalWorkingDays, daysWorked);
  }

  // 3. Update a Pay Slip by ID
  @Put(':id')
  async updatePaySlip(
    @Param('id') id: string,
    @Body() data: Prisma.PaySlipUpdateInput,
    @Body('totalWorkingDays') totalWorkingDays: number,
    @Body('daysWorked') daysWorked: number
  ) {
    return this.paySlipService.updatePaySlip(id, data, totalWorkingDays, daysWorked);
  }

  // 4. Delete a Pay Slip by ID
  @Delete(':id')
  async deletePaySlip(@Param('id') id: string) {
    return this.paySlipService.deletePaySlip(id);
  }

  // 5. Get All Pay Slips
  @Get()
  async getAllPaySlips() {
    return this.paySlipService.getAllPaySlips();
  }
}
