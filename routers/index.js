const express = require("express"),
	router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);

module.exports = router;
