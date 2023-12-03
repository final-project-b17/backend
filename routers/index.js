const courseController = require("../controllers/course.controller");

const express = require("express"),
	router = express.Router(),
	authRouter = require("./auth.routers"),
	categoryRouter = require("./category.router"),
	courseRouter = require("./course.router"),
	courseMaterialRouter= require("./courseMaterial.routers"),
	courseRouter = require("./course.router");

router.use("/auth", authRouter);
router.use("/categories", categoryRouter);
router.use("/courses", courseRouter);
router.use("/course-materials", courseMaterialRouter);

module.exports = router;
