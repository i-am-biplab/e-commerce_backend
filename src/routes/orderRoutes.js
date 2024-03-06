const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { checkoutOrder, showOrders, orderDetails, cancelOrder } = require("../controllers/orderCtrl");

const router = express.Router();

router.post("/", verifyToken, checkoutOrder);

router.post("/order-history", verifyToken, showOrders);

router.post("/order-details/:ordr_num", verifyToken, orderDetails);

router.post("/order-cancel/:ordr_num", verifyToken, cancelOrder);

module.exports = router;