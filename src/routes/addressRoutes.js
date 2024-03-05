const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { showAllAddr, addNewAddr, updateAddr, delAddr } = require("../controllers/userCtrl");

const router = express.Router();

router.post("/", verifyToken, showAllAddr);

router.post("/new-address", verifyToken, addNewAddr);

router.post("/update-address", verifyToken, updateAddr);

router.post("/delete-address/:addr_q", verifyToken, delAddr);

module.exports = router;