const Offer = require("../models/offer");
require("dotenv").config();

exports.create = async (req, res) => {
  try {
    if (req.auth.userRole !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to create an offer.",
      });
    }
    const {
      title,
      company,
      type,
      contract,
      location,
      skills,
    } = req.body;
    const offer = new Offer({
      title,
      company,
      type,
      contract,
      location,
      skills,
    });
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "Something went wrong while creating the offer.",
    });
  }
};

exports.getOfferRecommendations = async (req, res) => {
  const skills = req.query.skills;
  
  if (!skills) {
    return res.status(400).json({ message: "Aucune compétence fournie." });
  }

  const skillArray = Array.isArray(skills) ? skills : skills.split(',');

  try {
    const offers = await Offer.find({ skills: { $in: skillArray } });

    return res.status(200).json(offers);
  } catch (error) {
    console.error("Erreur lors de la récupération des offres :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des offres." });
  }
};

exports.apply = async (req, res) => {
  try {
    if (req.auth.userRole === "guest") {
      return res.status(403).json({
        message: "You do not have permission to update this offer.",
      });
    }
    const check = await Offer.findById(req.params.id)
    if (!check) {
      return res.status(404).json({
        message: "Didn't find the offer you were looking for.",
      });
    }
    if (!check.applied.includes(req.auth.userId)) {
      const offer = await Offer.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $push: { applied: req.auth.userId },
        },
        { new: true }
      );
      res.status(200).json(offer.applied);
    }
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to update your offer.",
    });
  }
};

exports.save = async (req, res) => {
  try {
    if (req.auth.userRole === "guest") {
      return res.status(403).json({
        message: "You do not have permission to update this offer.",
      });
    }
    const check = await Offer.findById(req.params.id)
    if (!check) {
      return res.status(404).json({
        message: "Didn't find the offer you were looking for.",
      });
    }
    if (check.saved.includes(req.auth.userId)) {
      const offer = await Offer.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $pull: { saved: req.auth.userId },
        },
        { new: true }
      );
      res.status(200).json(offer.saved);
    } else {
      const offer = await Offer.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $push: { saved: req.auth.userId },
      },
      { new: true }
    );
    res.status(200).json(offer.saved);
    }
    
    
    
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to update your offer.",
    });
  }
};
