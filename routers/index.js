const express = require("express"),
	router = express.Router(),
	authRouter = require("./auth.routers"),
	categoryRouter = require("./category.router"),
	courseRouter = require("./course.router"),
	chapterRouter = require("./chapter.router"),
	materialRouter = require("./materials.router"),
	ratingRouter = require("./rating.router"),
	paymentMethodRouter = require("./paymentMethod.router");

router.use("/auth", authRouter);
router.use("/categories", categoryRouter);
router.use("/courses", courseRouter);
router.use("/chapters", chapterRouter);
router.use("/course-materials", materialRouter);
router.use("/ratings", ratingRouter);
router.use("/paymentMethods", paymentMethodRouter);

module.exports = router;
