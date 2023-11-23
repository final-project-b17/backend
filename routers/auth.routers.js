const express = require("express"),
	router = express.Router(),
	controller = require("../controllers/auth.controller");

router.post("/register", controller.register);
router.post("/login", controller.login);

module.exports = router;
