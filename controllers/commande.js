const httpError = require("../models/error");

const user = require("../models/user");
const commande = require("../models/commande");

const { validationResult } = require("express-validator");
const article = require("../models/article");

const ajout = async (req, res, next) => {
  const { idClient, prix, adresse, gouvernerat } = req.body;

  const d = new Date();

  const createdCommande = new commande({
    idClient,
    date:
      d.getDay() +
      "/" +
      d.getMonth() +
      "/" +
      d.getFullYear() +
      "-" +
      d.getHours() +
      ":" +
      d.getMinutes(),
    prix,
    adresse,
    gouvernerat,
    statut: "En cours de préparation",
    produits: [],
  });

  let existinguser;
  try {
    existinguser = await user.findById(idClient);
  } catch (err) {
    const error = new httpError("failed !!!!, 500");
    return next(error);
  }

  try {
    await createdCommande.save();
    existinguser.commandes.push(createdCommande);
    existinguser.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ Commande: createdCommande });
};

const getCommande = async (req, res, next) => {
  let existingCommande;
  try {
    existingCommande = await commande.find();
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ Commande: existingCommande });
};

const getCommandeById = async (req, res, next) => {
  const id = req.params.id;
  let existingCommande;
  try {
    existingCommande = await commande.findById(id);
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ Commande: existingCommande });
};

const ajoutArticleToCommande = async (req, res, next) => {
  const { idArticle } = req.body;
  const id = req.params.id;
  let existingCommande;

  try {
    existingCommande = await commande.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }

  let existingArticle;

  try {
    existingArticle = await article.findById(idArticle);
  } catch {
    return next(new httpError("failed ", 500));
  }

  existingCommande.produits.push(existingArticle);

  try {
    existingCommande.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  res.status(200).json({ commande: existingCommande });
};

const validerCommande = async (req, res, next) => {

  const id = req.params.id;
  let existingCommande;

  try {
    existingCommande = await commande.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }

  existingCommande.statut = 'Valider';
  

  try {
    existingCommande.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  res.status(200).json({ commande: existingCommande });
};

const getCommandeByUser = async (req, res, next) => {
  const id = req.params.id;

  let existingCommande;
  try {
    existingCommande = await user.findById(id).populate("commandes");
  } catch (err) {
    const error = new httpError("Fetching failed", 500);
    return next(error);
  }

  if (!existingCommande || existingCommande.commandes.length === 0) {
    return next(new httpError("could not find article for this id.", 404));
  }

  res.json({
    existingCommande: existingCommande.commandes.map((item) =>
      item.toObject({ getters: true })
    ),
  });
};

exports.ajout = ajout;
exports.getCommande = getCommande;
exports.getCommandeById = getCommandeById;
exports.ajoutArticleToCommande = ajoutArticleToCommande;
exports.validerCommande = validerCommande
exports.getCommandeByUser = getCommandeByUser
