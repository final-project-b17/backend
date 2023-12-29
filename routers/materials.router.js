const express = require("express"),
	router = express.Router(),
	materialController = require("../controllers/courseMaterial.controller");
const authenticateUser = require("../middlewares/authentication");

router.get("/", materialController.listCourseMaterials);
router.get("/:id", materialController.listCourseMaterialsId);
router.post("/create", authenticateUser, materialController.createCourseMaterials);
router.put("/update/:id", authenticateUser, materialController.updateCourseMaterialsId);
router.delete("/delete/:id", authenticateUser, materialController.deleteCourseMaterialsId);

module.exports = router;
