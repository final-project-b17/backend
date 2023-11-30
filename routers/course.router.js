const express = require("express"),
	router = express.Router(),
	controller = require("../controllers/course.controller");

router.get("/", controller.listCourse);
router.get("/detail-course/:id", controller.detailCourse);

module.exports = router;
