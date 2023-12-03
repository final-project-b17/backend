const express = require("express"),
    router = express.Router(),
    controller = require("../controllers/comment.controller");

router.post("/create", controller.createComment);
router.get("/", controller.getComments);
router.get("/:id", controller.getCommentById);
router.put("/update/:id", controller.updateComment);
router.delete("/delete/:id", controller.deleteComment);

module.exports = router;