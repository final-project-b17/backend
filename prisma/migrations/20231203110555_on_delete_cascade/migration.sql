-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_course_id_fkey";

-- DropForeignKey
ALTER TABLE "CourseMaterial" DROP CONSTRAINT "CourseMaterial_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "CourseMaterial" DROP CONSTRAINT "CourseMaterial_course_id_fkey";

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMaterial" ADD CONSTRAINT "CourseMaterial_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMaterial" ADD CONSTRAINT "CourseMaterial_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
