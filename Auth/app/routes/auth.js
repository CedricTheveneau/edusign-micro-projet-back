const express = require("express");
const router = express();
const userCtrl = require("../controllers/user.js");
const auth = require("../middlewares/auth.js");


router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.put("/saveOffer/:id", auth, userCtrl.saveOffer);
router.put("/applyOffer/:id", auth, userCtrl.applyOffer);
router.get("/info", auth, userCtrl.getUserInfoFromToken);
router.get("/confirm-email/:token", userCtrl.confirmEmail);

module.exports = router;