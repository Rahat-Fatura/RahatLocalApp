var express = require("express");
var router = express.Router();

const erpCalls = require("./src");

router.get("/invoice", erpCalls.getInvoicePage);
router.get("/invoice/send/:id", erpCalls.sendManualInvoice);

module.exports = router;
