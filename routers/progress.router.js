const express = require("express"),
	router = express.Router(),
	controller = require("../controllers/progress.controller");
const authenticateUser = require("../middlewares/authentication");

router.get("/", authenticateUser, controller.getUserProgress);
router.post("/create", authenticateUser, controller.enrollCourse);

module.exports = router;
