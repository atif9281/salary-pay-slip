import { Injectable } from '@nestjs/common';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'; // Keep StandardFonts for Helvetica
import { PrismaService } from '../prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PdfService {
    constructor(private readonly prisma: PrismaService) { }

    async createPayslipPdf(id: string): Promise<Buffer> {
        try {
            // Fetch payslip data from the database using the provided ID
            console.log('Fetching payslip data...');
            const payslip = await this.prisma.paySlip.findUnique({
                where: { id },
                include: {
                    employee: {
                        include: {
                            department: true,
                        },
                    },
                },
            });

            if (!payslip) {
                throw new Error('Payslip not found');
            }
            console.log('Payslip data:', payslip);

            // Path to your PDF template in the root directory
            const templatePath = path.join(__dirname, '..', '..', 'paySlip.pdf');
            console.log('Template path:', templatePath);

            if (!fs.existsSync(templatePath)) {
                throw new Error('PDF template file not found');
            }

            const existingPdfBytes = fs.readFileSync(templatePath);
            console.log('Template loaded:', existingPdfBytes.length > 0);

            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            console.log('PDF document loaded:', pdfDoc);

            // Get the first page of the PDF
            const page = pdfDoc.getPage(0);

            // Load and embed the Helvetica font (Standard Font)
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            console.log('Helvetica font embedded');

            // Define text positions and styles
            const positions = {
                title: { x: 139, y: 700 },
                company: { x: 140, y: 670 },
                employeeId: { x: 139, y: 618 },
                employeeName: { x: 158, y: 604 },
                payPeriod: { x: 134, y: 582 },
                department: { x: 134, y: 561 },
                titlePosition: { x: 90, y: 546 },
                bankTitle: { x: 120, y: 532 },
                accountNo: { x: 129, y: 517 },
                location: { x: 144, y: 408 },
            };

            // Add employee information
            page.drawText(`${payslip.employee.id}`, {
                x: positions.employeeId.x,
                y: positions.employeeId.y,
                size: 11,
                font,
                color: rgb(0, 0, 0), // Black
                
            });
            page.drawText(`${payslip.employee.firstName} ${payslip.employee.lastName}`, {
                x: positions.employeeName.x,
                y: positions.employeeName.y,
                size: 11,
                font,
                color: rgb(0, 0, 0), // Black
            });
            page.drawText(`${payslip.month} ${payslip.year}`, {
                x: positions.payPeriod.x,
                y: positions.payPeriod.y,
                size: 11,
                font,
                color: rgb(0, 0, 0), // Black
            });
            page.drawText(`${payslip.employee.department.name}`, {
                x: positions.department.x,
                y: positions.department.y,
                size: 11,
                font,
                color: rgb(0, 0, 0), // Black
            });
            page.drawText(`${payslip.employee.position}`, {
                x: positions.titlePosition.x,
                y: positions.titlePosition.y,
                size: 11,
                font,
                color: rgb(0, 0, 0), // Black
            });
            page.drawText(`${payslip.employee.bankName}`, {
                x: positions.bankTitle.x,
                y: positions.bankTitle.y,
                size: 11,
                font,
                color: rgb(0, 0, 0), // Black
            });
            page.drawText(`${payslip.employee.bankAccountNumber}`, {
                x: positions.accountNo.x,
                y: positions.accountNo.y,
                size: 11,
                font,
                color: rgb(0, 0, 0), // Black
            });
            page.drawText(``, {
                x: positions.location.x,
                y: positions.location.y,
                size: 12,
                font,
                color: rgb(0, 0, 0), // Black
            });

            // Serialize the document to bytes
            const pdfBytes = await pdfDoc.save();
            console.log('PDF document saved');

            // Return the PDF buffer
            return Buffer.from(pdfBytes);
        } catch (error) {
            console.error('Error generating payslip:', error);
            throw new Error(`Failed to generate payslip PDF: ${error.message}`);
        }
    }
}
