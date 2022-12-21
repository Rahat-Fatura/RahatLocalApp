var express = require("express");
var router = express.Router();

const routers = require("./src");

router.use("/", routers);

module.exports = router;
