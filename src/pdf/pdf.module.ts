import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Adjust the path as needed

@Module({
  imports: [PrismaModule], // Import PrismaModule to use PrismaService
  providers: [PdfService],
  controllers: [PdfController],
})
export class PdfModule {}
