const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { updateUser } = require("../controllers/userCtrl");

const router = express.Router();

router.post("/update", verifyToken, updateUser);

module.exports = router;