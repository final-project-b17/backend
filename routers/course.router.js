const express = require("express"),
	router = express.Router(),
	courseController = require("../controllers/course.controller");

router.get("/", courseController.listCourse);
router.post("/create", courseController.createCourse);
router.get("/detail/:id", courseController.detailCourse);
router.put("/update/:id", courseController.updateCourse);
router.delete("/delete/:id", courseController.deleteCourseById);

module.exports = router;
