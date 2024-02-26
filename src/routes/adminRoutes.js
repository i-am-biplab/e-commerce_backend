const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const { blockUser, unBlockUser } = require("../controllers/adminCtrl");

const router = express.Router();

router.post("/block-user", isAdmin, blockUser);

router.post("/unblock-user", isAdmin, unBlockUser);

module.exports = router;