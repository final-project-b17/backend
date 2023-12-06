const express = require("express"),
	router = express.Router(),
	multer = require("../middlewares/multer"),
	multerLib = require('multer')(),
	courseController = require("../controllers/course.controller");

router.get("/", courseController.listCourse);
router.post("/create", multerLib.single('thumbnail'), courseController.createCourse);
router.get("/detail/:id", courseController.detailCourse);
router.put("/update/:id", multerLib.single('thumbnail'), courseController.updateCourse);
router.delete("/delete/:id", courseController.deleteCourseById);

module.exports = router;
