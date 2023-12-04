-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "thumbnail" TEXT;

-- AlterTable
ALTER TABLE "PaymentMethod" ALTER COLUMN "is_active" SET DEFAULT true;
