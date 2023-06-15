var express = require("express");
var router = express.Router();

const erpCalls = require("./src");

router.get("/", erpCalls.getInvoicePage);
router.get("/send/:id", erpCalls.sendManualInvoice);

module.exports = router;
