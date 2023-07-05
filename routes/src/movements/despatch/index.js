var express = require("express");
var router = express.Router();

const sendingRouter = require("./sending");

router.use("/", sendingRouter);

module.exports = router;
