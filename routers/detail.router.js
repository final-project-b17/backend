const express = require("express"),
    router = express.Router(),
    controller = require("../controllers/detail.controller");

router.get("/detail/:id", controller.detailCourse);

module.exports = router;
