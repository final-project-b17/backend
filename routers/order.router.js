const express = require("express");
const orderController = require("../controllers/order.controller");
const authenticateUser = require("../middlewares/authentication");
const router = express.Router();

router.post("/create", authenticateUser, orderController.createOrder);
router.get("/history", authenticateUser, orderController.myOrder);
router.post("/callback", orderController.xenditCallback);

module.exports = router;
