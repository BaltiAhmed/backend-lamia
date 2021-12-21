const httpError = require("../models/error");

const user = require("../models/user");
const article = require("../models/article");
const commande = require("../models/commande");
const demandeRetourArticle = require("../models/demandeRetourArticle");

const ajout = async (req, res, next) => {
  const { sujet, idCommande, idArticle } = req.body;

  let existingArticle;

  try {
    existingArticle = await article.findById(idArticle);
  } catch {
    return next(new httpError("failed ", 500));
  }

  let existingCommande;

  try {
    existingCommande = await commande.findById(idCommande);
  } catch {
    return next(new httpError("failed ", 500));
  }

  const createdDemandeRetourArticle = new demandeRetourArticle({
    sujet,
    idCommande,
    idArticle,
    prixAticle: existingArticle.prix,
    prixCommande: existingCommande.prix,
    nomArticle: existingArticle.nom,
    imageArticle: existingArticle.image,
    valider: false,
  });

  try {
    await createdDemandeRetourArticle.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ createdDemandeRetourArticle: createdDemandeRetourArticle });
};

const SuprimerArticleCommande = async (req, res, next) => {
  const { idArticle, idCommande, idDemande } = req.body;

  let existingArticle;

  try {
    existingArticle = await article.findById(idArticle);
  } catch {
    return next(new httpError("failed ", 500));
  }

  let existingCommande;

  try {
    existingCommande = await commande.findById(idCommande);
  } catch {
    return next(new httpError("failed ", 500));
  }

  let existingDemande;

  try {
    existingDemande = await demandeRetourArticle.findById(idDemande);
  } catch {
    return next(new httpError("failed ", 500));
  }

  existingCommande.prix = existingCommande.prix - existingArticle.prix;
  existingDemande.prixCommande = existingCommande.prix;
  existingDemande.valider = true;

  console.log(existingArticle._id);

  try {
    const index = existingCommande.produits.indexOf(existingArticle._id);
    existingCommande.produits.splice(index, 1);
    console.log(existingCommande);
    existingCommande.save();

    existingDemande.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  res.status(200).json({ commande: existingCommande });
};

const getDemandeRetourArticle = async (req, res, next) => {
  let existingDemande;
  try {
    existingDemande = await demandeRetourArticle.find();
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existingDemande: existingDemande });
};

exports.ajout = ajout;
exports.SuprimerArticleCommande = SuprimerArticleCommande;
exports.getDemandeRetourArticle = getDemandeRetourArticle;
