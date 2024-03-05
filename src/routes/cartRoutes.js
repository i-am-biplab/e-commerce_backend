const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { showCart, addToCart, incQty, decQty, rmFromCart, delCart } = require("../controllers/cartCtrl");

const router = express.Router();

router.post("/", verifyToken, showCart);

router.post("/add/:pid", verifyToken, addToCart);

router.post("/qty-inc/:cid", verifyToken, incQty);

router.post("/qty-dec/:cid", verifyToken, decQty);

router.post("/remove/:cid", verifyToken, rmFromCart);

router.post("/delete", verifyToken, delCart);

module.exports = router;