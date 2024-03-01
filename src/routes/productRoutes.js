const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const isSeller = require("../middlewares/isSeller");
const { showProduct, searchProduct, addProduct, updateProduct, deleteProduct } = require("../controllers/productCtrl");

const router = express.Router();

router.post("/", verifyToken, showProduct);

router.post("/search", verifyToken, searchProduct);

router.post("/add", isSeller, addProduct);

router.post("/update", isSeller, updateProduct);

router.post("/delete", isSeller, deleteProduct);

module.exports = router;