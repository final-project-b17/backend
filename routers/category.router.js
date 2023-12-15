const express = require("express"),
	router = express.Router(),
	multer = require("../middlewares/multer"),
	multerLib = require('multer')(),
	controller = require("../controllers/category.controller");

router.get("/", controller.listCategories);
router.post("/create", multerLib.single('thumbnail'), controller.createCategory);
router.get("/detail/:id", controller.detailCategory);
router.put("/update/:id", multerLib.single('thumbnail'), controller.updateCategory);
router.delete("/delete/:id", controller.deleteCategory);

module.exports = router;
