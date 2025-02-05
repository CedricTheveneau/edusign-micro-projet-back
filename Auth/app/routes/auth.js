const express = require("express");
const router = express();
const userCtrl = require("../controllers/user.js");
const auth = require("../middlewares/auth.js");


router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.put("/saveOffer/:id", auth, userCtrl.saveOffer);
router.put("/applyOffer/:id", auth, userCtrl.applyOffer);
router.put("/removeOfferByIds", auth, userCtrl.removeOfferByIds);
router.put("/:id", auth, userCtrl.update);
router.delete("/:id",auth, userCtrl.delete);
router.get("/info", auth, userCtrl.getUserInfoFromToken);
router.get("/username/:username", userCtrl.getUserByUsername);
router.get("/confirm-email/:token", userCtrl.confirmEmail);

module.exports = router;