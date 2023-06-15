var express = require("express");
var router = express.Router();

const sendingCalls = require("./src");

router.get("/", sendingCalls.getInvoiceSendingPage);
router.get("/dt-list", sendingCalls.getInvoiceSendingList);

module.exports = router;
