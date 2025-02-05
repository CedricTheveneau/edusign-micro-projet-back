const express = require("express");
const router = express();
const authRoutes = require("./auth.js");

router.use("/", authRoutes);

module.exports = router;