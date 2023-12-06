const express = require("express"),
	router = express.Router(),
	controller = require("../controllers/category.controller");

router.get("/", controller.listCategories);
router.post("/create", controller.createCategory);
router.get("/detail/:id", controller.detailCategory);
router.put("/update/:id", controller.updateCategory);
router.delete("/delete/:id", controller.deleteCategory);

module.exports = router;
