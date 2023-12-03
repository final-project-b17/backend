const express = require("express"),
	router = express.Router(),
	courseController = require("../controllers/course.controller"),
	chapterController = require("../controllers/chapter.controller"),
	MaterialsController = require("../controllers/courseMaterial.controller");

// /courses
router.get("/", courseController.listCourse);
router.get("/detail-course/:id", courseController.detailCourse);

// /courses/chapters
router.get("/chapters", chapterController.getChapters);
router.post("/chapters/create", chapterController.createChapter);
router.get("/chapters/:id", chapterController.getChapterId);
router.put("/chapters/update/:id", chapterController.updateChapterId);
router.delete("/chapters/delete/:id", chapterController.deleteChapterId);

// /courses/chapter/course-materials
router.get("/chapters/:id/course-materials/", MaterialsController.listCourseMaterials);
router.post("/chapters/:id/course-materials/create", MaterialsController.createCourseMaterials);
router.get("/chapters/course-materials/:id", MaterialsController.listCourseMaterialsId);
router.put("/chapters/course-materials/update", MaterialsController.updateCourseMaterialsId);
router.put("/chapters/course-materials/delete", MaterialsController.deleteCourseMaterialsId);

module.exports = router;
