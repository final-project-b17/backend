const express = require("express");
const orderController = require("../controllers/order.controller");
const authenticateUser = require("../middlewares/authentication");
const router = express.Router();

// POST /orders
router.post("/", authenticateUser, orderController.createOrder);

module.exports = router;
