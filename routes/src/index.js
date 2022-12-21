var express = require("express");
var router = express.Router();

const dashboardRouter = require("./dashboard");
const streamRouter = require("./stream");
const movementsRouter = require("./movements");
const definitionsRouter = require("./definitions");

router.use("/", dashboardRouter);
router.use("/stream", streamRouter);
router.use("/movements", movementsRouter);
router.use("/definitions", definitionsRouter);

module.exports = router;
