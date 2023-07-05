var express = require("express");
var router = express.Router();

const despatchCalls = require("./src");

router.get("/insert/:id", despatchCalls.insertDespatch);
router.get("/update/:id", despatchCalls.updateDespatch);
router.get("/delete/:id", despatchCalls.deleteDespatch);

module.exports = router;
