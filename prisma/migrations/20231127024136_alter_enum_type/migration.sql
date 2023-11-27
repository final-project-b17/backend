/*
  Warnings:

  - Changed the type of `type_course` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `level` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TypeCourse" AS ENUM ('premium', 'free');

-- CreateEnum
CREATE TYPE "LevelCourse" AS ENUM ('pemula', 'menengah', 'lanjutan');

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "type_course",
ADD COLUMN     "type_course" "TypeCourse" NOT NULL,
DROP COLUMN "level",
ADD COLUMN     "level" "LevelCourse" NOT NULL;
