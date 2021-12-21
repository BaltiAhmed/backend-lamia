const httpError = require("../models/error");

const livreur = require("../models/livreur");

const ajout = async (req, res, next) => {
  const { name, email } = req.body;

  const createdLivreur = new livreur({
    name,
    email,
  });

  try {
    await createdLivreur.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ livreur: createdLivreur });
};

const getLivreur = async (req, res, next) => {
  let existingLivreur;
  try {
    existingLivreur = await livreur.find();
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existingLivreur: existingLivreur });
};

const updateLivreur = async (req, res, next) => {
  const { name, email } = req.body;
  const id = req.params.id;
  let existingLivreur;

  try {
    existingLivreur = await livreur.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }

  existingLivreur.name = name;
  existingLivreur.email = email;

  try {
    existingLivreur.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  res.status(200).json({ existingLivreur: existingLivreur });
};

const deleteLivreur = async (req, res, next) => {
  const id = req.params.id;
  let existingLivreur;

  try {
    existingLivreur = await livreur.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }
  if (!existingLivreur) {
    return next(new httpError("article does not exist", 500));
  }

  try {
    await existingLivreur.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};

exports.ajout = ajout;
exports.getLivreur = getLivreur;
exports.updateLivreur = updateLivreur;
exports.deleteLivreur =deleteLivreur
