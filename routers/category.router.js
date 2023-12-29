const express = require("express"),
	router = express.Router(),
	multerLib = require("multer")(),
	controller = require("../controllers/category.controller");
const authenticateUser = require("../middlewares/authentication");

router.get("/", controller.listCategories);
router.get("/detail/:id", controller.detailCategory);
router.post("/create", authenticateUser, multerLib.single("thumbnail"), controller.createCategory);
router.put("/update/:id", authenticateUser, multerLib.single("thumbnail"), controller.updateCategory);
router.delete("/delete/:id", authenticateUser, controller.deleteCategory);

module.exports = router;
