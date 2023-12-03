const express = require("express"),
	router = express.Router(),
	courseController = require("../controllers/course.controller");

// /courses
router.get("/", courseController.listCourse);
router.get("/detail-course/:id", courseController.detailCourse);

module.exports = router;
