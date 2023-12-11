const express = require("express"),
	router = express.Router(),
	enrollmentController = require("../controllers/enrollment.controller");
const authenticateUser = require("../middlewares/authentication");

router.post("/create", authenticateUser, enrollmentController.enrollCourse);
router.get("/progress", authenticateUser, enrollmentController.getUserEnrolledCourses);
router.post("/complete/:course_material_id", authenticateUser, enrollmentController.markMaterialAsComplete);

module.exports = router;
