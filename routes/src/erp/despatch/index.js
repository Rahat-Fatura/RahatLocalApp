var express = require("express");
var router = express.Router();

const erpCalls = require("./src");

router.get("/", erpCalls.getDespatchPage);
router.get("/send/:id", erpCalls.sendManualDespatch);

module.exports = router;
