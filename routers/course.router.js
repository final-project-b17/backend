const express = require("express"),
	router = express.Router(),
	courseController = require("../controllers/course.controller");

// /courses
router.get("/", courseController.listCourse);
router.post("/add-course", courseController.createCourse);
router.get("/detail-course/:id", courseController.detailCourse);
router.put("/update/:id", courseController.updateCourse);
router.delete("/delete/:id", courseController.deleteCourseById);

module.exports = router;
