const express = require("express"),
	router = express.Router(),
	multerLib = require("multer")(),
	paymentMethodController = require("../controllers/paymentMethod.controller");
const authenticateUser = require("../middlewares/authentication");

router.get("/", paymentMethodController.getPaymentMethods);
router.get("/:id", paymentMethodController.getPaymentMethodId);
router.post("/create", authenticateUser, multerLib.single("logo"), paymentMethodController.createPaymentMethod);
router.put("/update/:id", authenticateUser, multerLib.single("logo"), paymentMethodController.updatePaymentMethodId);
router.delete("/delete/:id", authenticateUser, paymentMethodController.deletePaymentMethodId);

module.exports = router;
