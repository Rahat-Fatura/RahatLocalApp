var express = require("express");
var router = express.Router();

const sendingCalls = require("./src");

router.get("/invoice", sendingCalls.getInvoiceSendingPage);
router.get("/invoice/dt-list", sendingCalls.getInvoiceSendingList);

module.exports = router;
