const express = require("express"),
    router = express.Router(),
    controller = require("../controllers/chapter.controller");

router.post("/create", controller.createChapter);
router.get("/", controller.getChapters);
router.get("/:id", controller.getChapterId);
router.put("/update/:id", controller.updateChapterId);
router.delete("/delete/:id", controller.deleteChapterId);

module.exports = router;