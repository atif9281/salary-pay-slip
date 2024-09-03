import { Module } from '@nestjs/common';
import { PaySlipService } from './payslip.service';
import { PaySlipController } from './payslip.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaySlipController],
  providers: [PaySlipService],
})
export class PaySlipModule {}
