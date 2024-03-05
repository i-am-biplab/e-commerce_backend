const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { checkoutOrder } = require("../controllers/orderCtrl");

const router = express.Router();

router.post("/", verifyToken, checkoutOrder);

module.exports = router;