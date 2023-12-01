const express = require("express"),
	router = express.Router(),
	courseMaterialcontroller = require("../controllers/courseMaterial.controller");

router.post("/create", courseMaterialcontroller.createCourseMaterials);
router.get("/", courseMaterialcontroller.listCourseMaterials);
router.get("/:id", courseMaterialcontroller.listCourseMaterialsId);
router.put("/update", courseMaterialcontroller.updateCourseMaterialsId);
router.put("/delete", courseMaterialcontroller.deleteCourseMaterialsId);

module.exports = router;