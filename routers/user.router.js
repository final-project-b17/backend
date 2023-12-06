const express = require("express"),
	router = express.Router(),
	userController = require("../controllers/user.controller");
const authenticateUser = require("../middlewares/authentication");

router.get("/my-profile", authenticateUser, userController.getMyProfile);
router.get("/my-course", authenticateUser, userController.getMyCourseHistory);
router.put("/update-profile", authenticateUser, userController.updateMyProfile);
router.put("/update-password", authenticateUser, userController.updateMyPassword);

module.exports = router;
