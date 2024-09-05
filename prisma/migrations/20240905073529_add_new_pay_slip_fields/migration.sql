/*
  Warnings:

  - Made the column `daysWorked` on table `PaySlip` required. This step will fail if there are existing NULL values in that column.
  - Made the column `paidLeaves` on table `PaySlip` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalWorkingDays` on table `PaySlip` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unpaidLeaves` on table `PaySlip` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PaySlip" ALTER COLUMN "daysWorked" SET NOT NULL,
ALTER COLUMN "paidLeaves" SET NOT NULL,
ALTER COLUMN "totalWorkingDays" SET NOT NULL,
ALTER COLUMN "unpaidLeaves" SET NOT NULL;
