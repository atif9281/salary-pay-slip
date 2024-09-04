import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { PaySlipModule } from './payslip/payslip.module';
import { DepartmentModule } from './department/department.module';
import { PrismaModule } from './prisma/prisma.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [EmployeeModule, PaySlipModule, DepartmentModule, PrismaModule, PdfModule],
})
export class AppModule {}
