const express = require("express");
const router = express();
const articleRoutes = require("./offer.js");

router.use("/", articleRoutes);

module.exports = router;