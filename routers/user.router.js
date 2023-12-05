const express = require("express"),
	router = express.Router(),
	controller = require("../controllers/user.controller");
const authenticateUser = require("../middlewares/authentication");

router.get("/my-profile", authenticateUser, controller.getMyProfile);
router.put("/update-profile", authenticateUser, controller.updateMyProfile);
router.put("/update-password", authenticateUser, controller.updateMyPassword);

module.exports = router;
