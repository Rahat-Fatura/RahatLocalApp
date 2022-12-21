var express = require("express");
var router = express.Router();

const invoiceCalls = require("./src");

router.get("/", invoiceCalls.getQueriesInvoicePage);
router.post("/", invoiceCalls.updateQueriesInvoice);

module.exports = router;
