var express = require("express");
var router = express.Router();

const sendingRouter = require("./sending");

router.use("/sending", sendingRouter);

module.exports = router;
