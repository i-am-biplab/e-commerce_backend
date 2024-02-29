const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { showProduct, searchProduct } = require("../controllers/productCtrl");

const router = express.Router();

router.post("/", verifyToken, showProduct);

router.post("/search", verifyToken, searchProduct);

router.get("/add", (req, res) => {
    res.send("Hello product");
});

router.get("/update", (req, res) => {
    res.send("Hello product");
});

router.get("/delete", (req, res) => {
    res.send("Hello product");
});

module.exports = router;