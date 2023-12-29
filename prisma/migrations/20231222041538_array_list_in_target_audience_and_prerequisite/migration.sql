/*
  Warnings:

  - The `prerequisite` column on the `Course` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `target_audience` column on the `Course` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "prerequisite",
ADD COLUMN     "prerequisite" TEXT[],
DROP COLUMN "target_audience",
ADD COLUMN     "target_audience" TEXT[];
