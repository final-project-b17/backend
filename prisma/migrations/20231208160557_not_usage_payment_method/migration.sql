-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_payment_methods_id_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "payment_methods_id" DROP NOT NULL;
