const express = require("express");
const router = express();
const articleCtrl = require("../controllers/offer.js");
const bouncer = require("../middlewares/bouncer.js");

router.post("/create", bouncer, articleCtrl.create);
router.get("/", articleCtrl.getAll);
router.get("/latest", articleCtrl.getLatest);
router.get("/recent", articleCtrl.getNextArticles);
router.get("/top", articleCtrl.getTopArticles);
router.get("/by-ids", articleCtrl.getArticlesByIds);
router.get("/search", articleCtrl.getArticlesByQuery);
router.get("/:id", articleCtrl.getArticle);
router.get("/keyword/:keyword", articleCtrl.getArticlesByKeyword);
router.get("/category/:category", articleCtrl.getArticlesByCategory);
router.get("/recommendations/:id", bouncer, articleCtrl.getArticleRecommendations);
router.put("/admin/:id", bouncer, articleCtrl.updateAdmin);
router.put("/removeCommentsByIds", bouncer, articleCtrl.removeCommentsByIds);
router.put("/upvote/:id", bouncer, articleCtrl.upvote);
router.put("/comment/:id", bouncer, articleCtrl.comment);
router.put("/save/:id", bouncer, articleCtrl.save);
router.put("/read/:id", bouncer, articleCtrl.addRead);
router.delete("/:id", bouncer, articleCtrl.delete);
router.post("/deleteArticleFile", bouncer, articleCtrl.deleteArticleFile)

module.exports = router;