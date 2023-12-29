const express = require("express"),
	router = express.Router(),
	multerLib = require("multer")(),
	courseController = require("../controllers/course.controller");
const authenticateUser = require("../middlewares/authentication");

router.get("/", courseController.listCourse);
router.get("/detail/:id", courseController.detailCourse);
router.post("/create", authenticateUser, multerLib.single("thumbnail"), courseController.createCourse);
router.put("/update/:id", authenticateUser, multerLib.single("thumbnail"), courseController.updateCourse);
router.delete("/delete/:id", authenticateUser, courseController.deleteCourseById);

module.exports = router;
