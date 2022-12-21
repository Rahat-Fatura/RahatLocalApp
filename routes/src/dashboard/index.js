var express = require("express");
var router = express.Router();

const dashboardCalls = require("./src");

router.get("/", dashboardCalls.getDashboardPage);

module.exports = router;
