import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PaySlipService } from './payslip.service';
import { Prisma } from '@prisma/client';

@Controller('payslip')
export class PaySlipController {
  constructor(private readonly paySlipService: PaySlipService) {}

  @Post()
  create(@Body() data: Prisma.PaySlipCreateInput) {
    return this.paySlipService.createPaySlip(data);
  }

  @Get()
  findAll() {
    return this.paySlipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paySlipService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.PaySlipUpdateInput) {
    return this.paySlipService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paySlipService.remove(id);
  }
}
