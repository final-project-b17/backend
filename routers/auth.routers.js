const express = require("express"),
	router = express.Router(),
	controller = require("../controllers/auth.controller");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/reset-password", controller.resetPassword);
router.post("/set-password", controller.setPassword);

module.exports = router;
