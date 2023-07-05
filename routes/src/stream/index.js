var express = require("express");
var router = express.Router();

const invoiceRouter = require("./invoice");
const despatchRouter = require("./despatch");

router.use("/invoice", invoiceRouter);
router.use("/despatch", despatchRouter);

module.exports = router;
