var express = require("express");
var router = express.Router();

const invoiceCalls = require("./src");

router.get("/insert/:id", invoiceCalls.insertInvoice);
router.get("/update/:id", invoiceCalls.updateInvoice);

module.exports = router;
