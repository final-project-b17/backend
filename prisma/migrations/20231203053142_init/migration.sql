-- AlterTable
ALTER TABLE "User" ALTER COLUMN "otp_code" DROP NOT NULL,
ALTER COLUMN "resetPasswordToken" DROP NOT NULL;
