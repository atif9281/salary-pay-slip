import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule

@Module({
  imports: [PrismaModule], // Import PrismaModule here
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
