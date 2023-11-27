const express = require("express"),
	router = express.Router(),
	controller = require("../controllers/course.controller");

router.get("/", controller.listCourse);
router.get("/search", controller.searchAndFilter);

module.exports = router;
