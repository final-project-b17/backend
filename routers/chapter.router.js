const express = require("express"),
	router = express.Router(),
	controller = require("../controllers/chapter.controller");
const authenticateUser = require("../middlewares/authentication");

router.get("/", controller.getChapters);
router.get("/:id", controller.getChapterId);
router.post("/create", authenticateUser, controller.createChapter);
router.put("/update/:id", authenticateUser, controller.updateChapterId);
router.delete("/delete/:id", authenticateUser, controller.deleteChapterId);

module.exports = router;
