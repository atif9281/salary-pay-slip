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
                basicSalary: { x: 500, y: 600 },
                totalWorkingDays: { x: 100, y: 350 },
                daysWorked: { x: 250, y: 350 },
                paidLeaves: { x: 390, y: 350 },
                unpaidLeaves: { x: 500, y: 350 },
                deductions: { x: 420, y: 190 },

                bonuses: { x: 420, y: 170 },
                netSalary: { x: 420, y: 131 },
                payDate: { x: 113, y: 103 },
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
            page.drawText(`${payslip.basicSalary}`, {
                x: positions.basicSalary.x,
                y: positions.basicSalary.y,
                size: 11,
                font,
                color: rgb(0, 0, 0), // Black
            });
            page.drawText(`${payslip.totalWorkingDays}`, {
                x: positions.totalWorkingDays.x,
                y: positions.totalWorkingDays.y,
                size: 11,
                font,
                color: rgb(0, 0, 0), // Black
            });
            page.drawText(`${payslip.daysWorked}`, {
                x: positions.daysWorked.x,
                y: positions.daysWorked.y,
                size: 11,
                font,
                color: rgb(0, 0, 0), // Black
            });
            page.drawText(`${payslip.paidLeaves}`, {
                x: positions.paidLeaves.x,
                y: positions.paidLeaves.y,
                size: 11,
                font,
                color: rgb(0, 0, 0), // Black
            });
            page.drawText(`${payslip.unpaidLeaves}`, {
                x: positions.unpaidLeaves.x,
                y: positions.unpaidLeaves.y,
                size: 11,
                font,
                color: rgb(0, 0, 0), // Black
            });

            // Convert Decimal to number and round them to the nearest whole number
            const formattedDeductions = Math.round(payslip.deductions.toNumber());
            const formattedBonuses = Math.round(payslip.bonuses.toNumber());
            const formattedNetSalary = Math.round(payslip.netSalary.toNumber());

            // Draw the formatted numbers on the PDF
            page.drawText(`${formattedDeductions}`, {
                x: positions.deductions.x,
                y: positions.deductions.y,
                size: 11,
                font,
                color: rgb(0, 0, 0), // Black
            });

            page.drawText(`${formattedBonuses}`, {
                x: positions.bonuses.x,
                y: positions.bonuses.y,
                size: 11,
                font,
                color: rgb(0, 0, 0), // Black
            });

            page.drawText(`${formattedNetSalary}`, {
                x: positions.netSalary.x,
                y: positions.netSalary.y,
                size: 11,
                font,
                color: rgb(0, 0, 0), // Black
            });
            const payDate = new Date(payslip.payDate);
            const formattedDate = payDate.toLocaleDateString('en-US', {
                weekday: 'long', // e.g. "Monday"
                year: 'numeric', // e.g. "2024"
                month: 'long',   // e.g. "September"
                day: 'numeric'   // e.g. "5"
            });

            page.drawText(formattedDate, {
                x: positions.payDate.x,
                y: positions.payDate.y,
                size: 11,
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
