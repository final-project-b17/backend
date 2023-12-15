-- AlterTable
ALTER TABLE "UserCourseProgress" ALTER COLUMN "completed_at" DROP NOT NULL,
ALTER COLUMN "completed_at" DROP DEFAULT;
