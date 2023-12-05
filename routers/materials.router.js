const express = require("express"),
	router = express.Router(),
	materialController = require("../controllers/courseMaterial.controller");

router.post("/create", materialController.createCourseMaterials);
router.get("/", materialController.listCourseMaterials);
router.get("/:id", materialController.listCourseMaterialsId);
router.put("/update/:id", materialController.updateCourseMaterialsId);
router.put("/delete/:id", materialController.deleteCourseMaterialsId);

module.exports = router;
