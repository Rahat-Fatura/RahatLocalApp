var express = require("express");
var router = express.Router();

const dashboardRouter = require("./dashboard");
const streamRouter = require("./stream");
const movementsRouter = require("./movements");
const erpRouter = require("./erp");
const definitionsRouter = require("./definitions");

router.use("/", dashboardRouter);
router.use("/stream", streamRouter);
router.use("/movements", movementsRouter);
router.use("/erp", erpRouter);
router.use("/definitions", definitionsRouter);

module.exports = router;
