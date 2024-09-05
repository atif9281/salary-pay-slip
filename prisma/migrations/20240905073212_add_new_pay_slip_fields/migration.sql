-- Add new columns with default values
ALTER TABLE "PaySlip"
ADD COLUMN "daysWorked" INT DEFAULT 0;

ALTER TABLE "PaySlip"
ADD COLUMN "paidLeaves" INT DEFAULT 0;

ALTER TABLE "PaySlip"
ADD COLUMN "totalWorkingDays" INT DEFAULT 0;

ALTER TABLE "PaySlip"
ADD COLUMN "unpaidLeaves" INT DEFAULT 0;
