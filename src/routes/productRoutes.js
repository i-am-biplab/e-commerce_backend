const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const isSeller = require("../middlewares/isSeller");
const { showProduct, searchProduct, addProduct, updateProductTitle, updateProductDetails, deleteProduct } = require("../controllers/productCtrl");
const upload = require("../middlewares/uploadFile");

const router = express.Router();

router.post("/", verifyToken, showProduct);

router.post("/search", verifyToken, searchProduct);

router.post("/add", isSeller, upload.single("img"), addProduct);

// router.post("/add-img", isSeller, upload.single("img"), addProductImg);

router.post("/update-title/:id", isSeller, updateProductTitle);

router.post("/update-details/:id", isSeller, upload.single("img"), updateProductDetails);

router.post("/delete/:d", isSeller, deleteProduct);

module.exports = router;