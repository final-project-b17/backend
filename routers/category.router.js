const express = require("express"),
	router = express.Router(),
	controller = require("../controllers/category.controller");

router.get("/", controller.listCategories);
router.post("/create", controller.createCategory);
module.exports = router;
