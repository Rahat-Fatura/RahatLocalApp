var express = require("express");
var router = express.Router();

const sendingCalls = require("./src");

router.get("/", sendingCalls.getDespatchSendingPage);
router.get("/dt-list", sendingCalls.getDespatchSendingList);

module.exports = router;
