import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Prisma } from '@prisma/client';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  create(@Body() data: Prisma.DepartmentCreateInput) {
    return this.departmentService.createDepartment(data);
  }

  @Get()
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.DepartmentUpdateInput) {
    return this.departmentService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentService.remove(id);
  }
}
