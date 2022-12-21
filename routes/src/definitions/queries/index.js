var express = require("express");
var router = express.Router();

const invoiceRouter = require("./invoice");

router.use("/invoice", invoiceRouter);

module.exports = router;
