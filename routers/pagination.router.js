const express = require("express"),
    router = express.Router(),
    controller = require("../controllers/pagination.controller");

router.get("/courses/page/:page", controller.listCoursesWithPagination)

module.exports = router;