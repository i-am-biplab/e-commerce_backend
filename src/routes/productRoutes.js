const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const isSeller = require("../middlewares/isSeller");
const { showProduct, searchProduct, addProduct, addProductImg, updateProduct, deleteProduct } = require("../controllers/productCtrl");
const upload = require("../middlewares/uploadFile");

const router = express.Router();

router.post("/", verifyToken, showProduct);

router.post("/search", verifyToken, searchProduct);

router.post("/add", isSeller, addProduct);

router.post("/add-img", isSeller, upload.single("img"), addProductImg);

router.post("/update", isSeller, upload.single("img"), updateProduct);

router.post("/delete", isSeller, deleteProduct);

module.exports = router;