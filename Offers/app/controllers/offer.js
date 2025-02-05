const Article = require("../models/offer");
const mongoose = require('mongoose');
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.create = async (req, res) => {
  try {
    if (req.auth.userRole !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to create an article.",
      });
    }
    const {
      title,
      intro,
      cover,
      content,
      audio,
      keywords,
      category,
      author,
      readingTime,
    } = req.body;
    const article = new Article({
      title,
      intro,
      cover,
      content,
      audio,
      keywords,
      category,
      author,
      readingTime,
    });
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "Something went wrong while creating the article.",
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    let articles = await Article.find();
    res.status(200).json(articles);
    if (!articles) {
      return res.status(404).json({
        message: "Didn't find any article.",
      });
    }
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve articles.",
    });
  }
};

exports.getLatest = async (req, res) => {
  try {
    let article = await Article.findOne().sort({ _id: -1 });

    if (!article) {
      return res.status(404).json({
        message: "Didn't find any article.",
      });
    }

    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve the article.",
    });
  }
};

exports.getNextArticles = async (req, res) => {
  try {
    let articles = await Article.find()
      .sort({ _id: -1 })
      .skip(1) 
      .limit(6);

    if (articles.length === 0) {
      return res.status(404).json({
        message: "Didn't find any articles.",
      });
    }

    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve the articles.",
    });
  }
};

exports.getTopArticles = async (req, res) => {
  try {
    const topArticles = await Article.aggregate([
      {
        $project: {
          title: 1, // Inclure le titre dans le résultat
          readsCount: { $size: "$reads" }, // Compte des lectures
          upvotesCount: { $size: "$upvotes" }, // Compte des upvotes
          commentsCount: { $size: "$comments" }, // Compte des commentaires
          article: "$$ROOT", // Récupérer l'article entier
        },
      },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$upvotesCount", 100] }, // Poids pour les upvotes
              { $multiply: ["$commentsCount", 10] },  // Poids pour les commentaires
              "$readsCount", // Poids pour les lectures
            ],
          },
        },
      },
      {
        $sort: { score: -1 }, // Trier par score décroissant
      },
      {
        $limit: 6, // Limiter à 6 articles
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$article", // L'article entier
              { 
                score: "$score", // Ajouter le score
                readsCount: "$readsCount", // Compte des lectures
                upvotesCount: "$upvotesCount", // Compte des upvotes
                commentsCount: "$commentsCount" // Compte des commentaires
              }
            ]
          }
        }
      }
    ]);

    res.status(200).json(topArticles);
  } catch (error) {
    console.error('Erreur lors de la récupération des top articles :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.getArticle = async (req, res) => {
  try {
    let article = await Article.findOne({
      _id: req.params.id,
    });
    if (!article) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    }
    if (req.userId) {
          if (!article.reads.includes(req.userId)) {
          article = await Article.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { reads: req.userId },
      },
      { returnDocument: "after" }
    );
    }
    }
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your article.",
    });
  }
};

exports.addRead = async (req, res) => {
  try {
    let article = await Article.findOne({
      _id: req.params.id,
    });
    if (!article) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    }
    if (req.auth.userId) {
          if (!article.reads.includes(req.auth.userId)) {
          article = await Article.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { reads: req.auth.userId },
      },
      { returnDocument: "after" }
    );
    }
    }
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your article.",
    });
  }
};

exports.getArticlesByIds = async (req, res) => {
  const ids = req.query.ids;
  
  if (!ids) {
    return res.status(400).json({ message: "Aucun ID fourni." });
  }

  const idArray = Array.isArray(ids) ? ids : ids.split(',');

  try {
    const validIds = idArray.map(id => {
      if (mongoose.Types.ObjectId.isValid(id)) {
        return new mongoose.Types.ObjectId(id);
      } else {
        throw new Error(`ID non valide : ${id}`);
      }
    });

    const articles = await Article.find({ _id: { $in: validIds } });
    return res.status(200).json(articles);
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des articles." });
  }
};

exports.getArticlesByQuery = async (req, res) => {
  try {
    const { q } = req.query; // Récupère le paramètre de recherche

    if (!q) {
      return res.status(400).json({ message: "Aucun terme de recherche fourni" });
    }

    const query = {
      $or: [
        { keywords: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { title: { $regex: q, $options: "i" } },
        { intro: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    };

    const articles = await Article.find(query);
    return res.status(200).json(articles);
  } catch (error) {
    console.error("Erreur lors de la recherche d'articles :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.getArticlesByKeyword = async (req, res) => {
  try {
    let articles = await Article.find({
      keyword: req.params.keyword,
    });
    if (!articles) {
      return res.status(404).json({
        message: "Didn't find the articles you were looking for.",
      });
    }
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your articles.",
    });
  }
};

exports.getArticlesByCategory = async (req, res) => {
  try {
    let articles = await Article.find({
      category: req.params.category,
    });
    if (!articles) {
      return res.status(404).json({
        message: "Didn't find the articles you were looking for.",
      });
    }
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your articles.",
    });
  }
};

exports.getArticleRecommendations = async (req, res) => {
  try {
    const articleId = req.params.id; // ID de l'article en cours
    const userId = req.auth.userId; // ID de l'utilisateur

    // Vérifier si l'article demandé existe
    const currentArticle = await Article.findById(articleId);
    if (!currentArticle) {
      return res.status(404).json({ message: 'Article introuvable.' });
    }

    // 1. Rechercher des articles avec les mêmes mots-clés
    let recommendations = await Article.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(articleId) }, // Exclure l'article en cours
          reads: { $ne: userId },
        },
      },
      {
        $addFields: {
          commonKeywords: {
            $size: {
              $setIntersection: ['$keywords', currentArticle.keywords],
            },
          },
        },
      },
      {
        $match: { commonKeywords: { $gt: 0 } }, // Articles avec des mots-clés en commun
      },
      {
        $sort: { commonKeywords: -1 }, // Trier par nombre de mots-clés
      },
      {
        $limit: 3, // Limiter à 3 articles
      },
    ]);

    // 2. Si moins de 3 articles sont trouvés, chercher par catégorie
    if (recommendations.length < 3) {
      const additionalByCategory = await Article.find({
        _id: { $ne: new mongoose.Types.ObjectId(articleId) }, // Exclure l'article actuel
        category: currentArticle.category,
        reads: { $ne: userId },
      })
      .limit(3 - recommendations.length);

      // Ajouter des articles de catégorie sans doublons
      recommendations = recommendations.concat(additionalByCategory.filter(art => 
        !recommendations.some(rec => rec._id.equals(art._id))
      ));
    }

    // 3. Si moins de 3 articles sont trouvés, chercher les articles populaires
    if (recommendations.length < 3) {
      const additionalPopularArticles = await Article.find({
        _id: { $nin: recommendations.map((art) => art._id).concat(new mongoose.Types.ObjectId(articleId)) }, // Exclure l'article actuel
      })
      .sort({ upvotes: -1 })
      .limit(3 - recommendations.length)
      .lean();

      recommendations = recommendations.concat(additionalPopularArticles.filter(art => 
        !recommendations.some(rec => rec._id.equals(art._id))
      ));
    }

    // Envoi des recommandations
    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    if (req.auth.userRole !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to update this article.",
      });
    }
    const articleCheck = await Article.findById(req.params.id);
    if (!articleCheck) {
      return res.status(404).json({ message: "Article not found." });
    }
    const {
      title,
      intro,
      cover,
      content,
      audio,
      keywords,
      category,
      upvotes,
      comments,
      savedNumber,
      reads,
      readingTime,
    } = req.body;
    const lastModifiedDate = Date.now();
    const article = await Article.findOneAndUpdate(
      { _id: req.params.id },
      {
        title,
        intro,
        cover,
        content,
        audio,
        keywords,
        category,
        upvotes,
        comments,
        savedNumber,
        reads,
        readingTime,
        lastModifiedDate,
      },
      { returnDocument: "after" }
    );
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong with updating the article.",
    });
  }
};

exports.removeCommentsByIds = async (req, res) => {
  try {
    if (req.auth.userRole !== "admin" && req.auth.userRole !== "user") {
      return res.status(403).json({
        message: "You do not have permission to update this article.",
      });
    }
    
    const article = await Article.findById(req.body.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found." });
    }

    const toDelete = req.query.ids.split(",");
    article.comments = article.comments.filter(commentId => !toDelete.includes(commentId.toString()));

    const updatedArticle = await article.save();

    res.status(200).json(updatedArticle);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong with updating the article.",
    });
  }
};

exports.upvote = async (req, res) => {
  try {
    if (req.auth.userRole === "guest") {
      return res.status(403).json({
        message: "You do not have permission to update this article.",
      });
    }
    const check = await Article.findById(req.params.id)
    if (!check) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    }
    if (check.upvotes.includes(req.auth.userId)) {
      const article = await Article.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $pull: { upvotes: req.auth.userId },
        },
        { new: true }
      );
      res.status(200).json(article.upvotes);
    } else {
      const article = await Article.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $push: { upvotes: req.auth.userId },
      },
      { new: true }
    );
    res.status(200).json(article.upvotes);
    }
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to update your article.",
    });
  }
};

exports.comment = async (req, res) => {
  try {
    if (req.auth.userRole === "guest") {
      return res.status(403).json({
        message: "You do not have permission to update this article.",
      });
    }
    const check = await Article.findById(req.params.id)
    if (!check) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    } else {
      const article = await Article.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $push: { comments: req.body.commentId },
        },
        { new: true }
      );
      res.status(200).json(article.comments);
    }
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to update your article.",
    });
  }
};

exports.save = async (req, res) => {
  try {
    if (req.auth.userRole === "guest") {
      return res.status(403).json({
        message: "You do not have permission to update this article.",
      });
    }
    const check = await Article.findById(req.params.id)
    if (!check) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    }
    if (check.savedNumber.includes(req.auth.userId)) {
      const article = await Article.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $pull: { savedNumber: req.auth.userId },
        },
        { new: true }
      );
      res.status(200).json(article.savedNumber);
    } else {
      const article = await Article.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $push: { savedNumber: req.auth.userId },
      },
      { new: true }
    );
    res.status(200).json(article.savedNumber);
    }
    
    
    
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to update your article.",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    if (req.auth.userRole !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to delete this post.",
      });
    }
    const articleCheck = await Article.findById(req.params.id);
    if (!articleCheck) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    }
    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "The fellowing article has been deleted successfully.",
      article: articleCheck,
    });
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to delete your article.",
    });
  }
};

exports.deleteArticleFile = async (req, res) => {
  const { fileUrl, resourceType } = req.body;

  if (!fileUrl || !resourceType) {
    return res.status(400).json({ message: 'fileUrl et resourceType sont requis.' });
  }

  try {
    // Extraction du public_id à partir de l'URL
    const urlSegments = fileUrl.split('/');
    const publicIdWithExtension = urlSegments[urlSegments.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];

    // Appel de la méthode destroy de Cloudinary
    const options = { resource_type: resourceType };
    cloudinary.uploader.destroy(publicId, options, (error, result) => {
      if (error) {
        console.error("Erreur lors de la suppression sur Cloudinary:", error.message);
        return res.status(500).json({ message: 'La suppression du fichier sur Cloudinary a échoué.' });
      }
      if (result.result === "ok") {
        return res.json({ message: 'Fichier supprimé avec succès de Cloudinary.' });
      } else {
        throw new Error('La suppression du fichier sur Cloudinary a échoué.');
      }
    });
  } catch (error) {
    console.error("Erreur lors de la suppression sur Cloudinary:", error.message);
    return res.status(500).json({ message: error.message });
  }
};
