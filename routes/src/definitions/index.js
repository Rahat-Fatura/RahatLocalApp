var express = require("express");
var router = express.Router();

const queriesRouter = require("./queries");

router.use("/queries", queriesRouter);

module.exports = router;
