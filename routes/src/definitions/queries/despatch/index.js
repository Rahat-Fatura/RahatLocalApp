var express = require("express");
var router = express.Router();

const despatchCalls = require("./src");

router.get("/", despatchCalls.getQueriesDespatchPage);
router.post("/", despatchCalls.updateQueriesDespatch);

module.exports = router;
