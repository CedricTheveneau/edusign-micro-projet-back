const express = require("express");
const router = express();
const articleCtrl = require("../controllers/offer.js");
const bouncer = require("../middlewares/bouncer.js");

router.post("/create", bouncer, articleCtrl.create);
router.get("/recommendations/by-skills", bouncer, articleCtrl.getOfferRecommendations);
router.put("/apply/:id", bouncer, articleCtrl.apply);
router.put("/save/:id", bouncer, articleCtrl.save);

module.exports = router;