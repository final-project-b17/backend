const express = require("express"),
	router = express.Router(),
	multer = require('../middlewares/multer'),
    multerLib = require('multer')(),
	userController = require("../controllers/user.controller"),
	enrollController = require("../controllers/enrollment.controller");
const authenticateUser = require("../middlewares/authentication");

router.get("/my-profile", authenticateUser, userController.getMyProfile);
router.get("/my-course", authenticateUser, enrollController.getUserEnrolledCourses);
router.put("/update-profile", authenticateUser, multerLib.single('avatar'), userController.updateMyProfile);
router.put("/update-password", authenticateUser, userController.updateMyPassword);

module.exports = router;
