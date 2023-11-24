const express = require("express"),
	router = express.Router(),
	authRouter = require("./auth.routers");

// const authenticateUser = require("../middlewares/authentication");

router.use("/auth", authRouter);

module.exports = router;
