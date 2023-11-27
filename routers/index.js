const express = require("express"),
	router = express.Router(),
	authRouter = require("./auth.routers"),
	courseRouter = require("./course.router");

// const authenticateUser = require("../middlewares/authentication");

router.use("/auth", authRouter);
router.use("/courses", courseRouter);

module.exports = router;
