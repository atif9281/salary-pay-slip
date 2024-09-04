import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PdfService {
    constructor(private readonly prisma: PrismaService) { }

    async createPayslipPdf(id: string): Promise<Buffer> {
        // Fetch payslip data from the database using the provided ID
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

        // Create a new PDF document
        const doc = new PDFDocument({
            layout: 'portrait',
            margins: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50,
            },
        });

        // Create a writeable stream to capture the PDF output
        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);
            return pdfBuffer;
        });

        // Define the y-coordinate for the row
        const y = 40;

        // Define the x-coordinates and sizes for the text
        const xLeft = 100;
        const xRight = 300;
        const textWidthLeft = 200; // Adjust these based on your text width
        const textWidthRight = 300;

        // Define background colors
        const bgColorLeft = '#FFD700'; // Gold
        const bgColorRight = '#ADD8E6'; // Light Blue

        // Increase padding values as needed
        const padding = 10; // Increase this value to make the background larger

        // Add background color for "PAYSLIP"
        doc.rect(
            xLeft - padding, // Adjust x-coordinate for left alignment
            y - 20 - padding, // Adjust y-coordinate and top padding
            textWidthLeft + 2 * padding, // Increase width by padding on both sides
            40 + 2 * padding // Increase height by padding on top and bottom
        )
            .fill(bgColorLeft);

        // Add background color for "BXTRACK SOLUTIONS"
        doc.rect(
            xRight - padding, // Adjust x-coordinate for right alignment
            y - 20 - padding, // Adjust y-coordinate and top padding
            textWidthRight + 2 * padding, // Increase width by padding on both sides
            40 + 2 * padding // Increase height by padding on top and bottom
        )
            .fill(bgColorRight);

        // Add "PAYSLIP" text
        doc.fontSize(24).fillColor('black').text('PAYSLIP', xLeft, y, { align: 'left' });

        // Add "BXTRACK SOLUTIONS" text
        doc.fontSize(20).fillColor('black').text('BXTRACK SOLUTIONS', xRight, y, { align: 'center' });


        // Add employee information
        doc.fontSize(12).text(`Employee # : ${payslip.employee.id}`, 100, 80);
        doc.text(`Employee Name : ${payslip.employee.firstName} ${payslip.employee.lastName}`, 100, 100);
        doc.text(`Department: ${payslip.employee.department.name}`, 100, 120);
        doc.text(`Title: ${payslip.employee.position}`, 100, 140);

        // Add bank information
        doc.text(`Bank Title: ${payslip.employee.bankName}`, 100, 160);
        doc.text(`Account No: ${payslip.employee.bankAccountNumber}`, 100, 180);

        // Add location
        doc.text(`Location: `, 100, 200); // You may want to add a location field to your Employee model

        // Add working days and earnings table
        const tableData = [
            ['Description', 'Earnings'],
            ['Present', '9'],
            ['Salary Paid', `Rs ${payslip.basicSalary}`],
            ['Monthly Stipend', ''],
            ['Unpaid leaves', '1 (public holiday)'],
            ['Paid leaves', '12'],
            ['Bonus', `Rs ${payslip.bonuses}`],
        ];

        const tableWidth = 400;
        const tableHeight = 200;
        const tableX = 100;
        const tableY = 220;

        doc.rect(tableX, tableY, tableWidth, tableHeight).stroke();
        for (let i = 0; i < tableData.length; i++) {
            const row = tableData[i];
            for (let j = 0; j < row.length; j++) {
                const cellText = row[j];
                const cellWidth = tableWidth / row.length;
                const cellX = tableX + j * cellWidth;
                const cellY = tableY + i * 20;
                doc.fontSize(12).text(cellText, cellX, cellY, { width: cellWidth });
            }
        }

        // Add pay period and pay date
        doc.text(`Pay period: ${payslip.month} ${payslip.year}`, 100, 280);
        doc.text(`Pay Date: ${payslip.payDate.toDateString()}`, 100, 300);

        // Add HR signature
        doc.text(`HR, BXTrack Solutions`, 100, 320);

        // Finalize the PDF
        doc.end();

        // Return the PDF buffer
        return new Promise((resolve, reject) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', (err) => reject(err));
        });
    }
}