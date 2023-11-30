const express = require("express"),
	router = express.Router(),
	authRouter = require("./auth.routers"),
	categoryRouter = require("./category.router"),
	courseRouter = require("./course.router"),
	chapterRouter = require("./chapter.router");

// paginationRouter = require("./pagination.router");
// const authenticateUser = require("../middlewares/authentication");

router.use("/auth", authRouter);
router.use("/courses", courseRouter);
router.use("/categories", categoryRouter);
router.use("/chapters", chapterRouter);

module.exports = router;