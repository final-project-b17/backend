const express = require("express");
const orderController = require("../controllers/order.controller");

const router = express.Router();

// POST /orders
router.post("/", orderController.createOrder);

module.exports = router;
