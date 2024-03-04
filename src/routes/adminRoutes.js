const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const { blockUser, unBlockUser, deleteProduct } = require("../controllers/adminCtrl");

const router = express.Router();

router.post("/block-user", isAdmin, blockUser);

router.post("/unblock-user", isAdmin, unBlockUser);

router.post("/delete-product/:d", isAdmin, deleteProduct);

module.exports = router;