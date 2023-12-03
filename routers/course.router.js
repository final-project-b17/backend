const express = require("express"),
	router = express.Router(),
	controller = require("../controllers/course.controller");

router.get("/", controller.listCourse);
router.get("/search", controller.searchAndFilter);
router.get("/page/:page", controller.listCoursesWithPagination);

module.exports = router;
