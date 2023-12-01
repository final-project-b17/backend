const express = require("express"),
	router = express.Router(),
	courseController = require("../controllers/course.controller"),
	chapterController = require("../controllers/chapter.controller");

// /courses
router.get("/", courseController.listCourse);
router.get("/detail-course/:id", courseController.detailCourse);
router.post("/add-course", courseController.createCourse);

// /courses/chapters
router.get("/chapters", chapterController.getChapters);
router.post("/chapters/add-chapter", chapterController.createChapter);
router.get("/chapters/:id", chapterController.getChapterId);
router.put("/chapters/update/:id", chapterController.updateChapterId);
router.delete("/chapters/delete/:id", chapterController.deleteChapterId);

module.exports = router;
