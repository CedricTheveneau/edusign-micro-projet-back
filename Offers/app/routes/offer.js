const express = require("express");
const router = express();
const articleCtrl = require("../controllers/offer.js");
const bouncer = require("../middlewares/bouncer.js");

router.post("/create", bouncer, articleCtrl.create);
router.get("/", articleCtrl.getAll);
router.get("/:id", articleCtrl.getOffer);
router.get("/recommendations/by-skills", bouncer, articleCtrl.getOfferRecommendations);
router.put("/admin/:id", bouncer, articleCtrl.updateAdmin);
router.put("/apply/:id", bouncer, articleCtrl.apply);
router.put("/save/:id", bouncer, articleCtrl.save);
router.delete("/:id", bouncer, articleCtrl.delete);

module.exports = router;