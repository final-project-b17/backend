const express = require("express"),
	router = express.Router(),
	authRouter = require("./auth.routers"),
	categoryRouter = require("./category.router"),
	courseRouter = require("./course.router"),
	ratingRouter = require("./rating.router");

router.use("/auth", authRouter);
router.use("/categories", categoryRouter);
router.use("/courses", courseRouter);
router.use("/ratings", ratingRouter);

module.exports = router;
