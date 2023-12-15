const express = require("express"),
    router = express.Router(),
    multer = require('../middlewares/multer'),
    multerLib = require('multer')(),
    // multer = require('multer'),
    paymentMethodController = require("../controllers/paymentMethod.controller");

router.post('/create', multerLib.single('logo'), paymentMethodController.createPaymentMethod);
router.get("/", paymentMethodController.getPaymentMethods);
router.get("/:id", paymentMethodController.getPaymentMethodId);
router.put("/update/:id", multerLib.single('logo'), paymentMethodController.updatePaymentMethodId);
router.delete("/delete/:id", paymentMethodController.deletePaymentMethodId);

module.exports = router;